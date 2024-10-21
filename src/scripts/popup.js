document.getElementById('set-focus-btn').addEventListener('click', () => {
    const topic = document.getElementById('focus-topic').value;
  
    if (topic) {
      // Store the topic in local storage for access in other scripts
      chrome.storage.local.set({ focusTopic: topic }, () => {
        alert('Focus topic set to: ' + topic);
      });
    } else {
      alert('Please enter a valid topic!');
    }
  });
  