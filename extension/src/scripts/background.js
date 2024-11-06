chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get(['focus_topic_1', 'focus_point_2', 'focus_point_3'], (data) => {
        const focusPoints = [data.focus_topic_1, data.focus_point_2, data.focus_point_3];
  
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: getPageContent,
        }, (results) => {
          const content = results[0].result;
  
          fetch('http://localhost:5000/get_response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              focusPoints: focusPoints,
              content: content
            })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Response from backend:', data);
  
            // Format the message with the received data
            const notificationMessage = `
              Focus Point 1: ${data.focus_point_1_percentage}%\n
              Focus Point 2: ${data.focus_point_2_percentage}%\n
              Focus Point 3: ${data.focus_point_3_percentage}%\n
              ${data.message}
            `;
  
            // Display notification with formatted message
            chrome.notifications.create({
              type: 'basic',
              iconUrl: 'icon.png',  // Replace with your icon path
              title: 'Focus Analysis Result',
              message: notificationMessage,
            });
          })
          .catch(error => console.error('Error:', error));
        });
      });
    }
  });
  
  function getPageContent() {
    return document.body.innerText;
  }
  