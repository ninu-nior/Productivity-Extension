chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Retrieve stored focus points
    chrome.storage.local.get(['focus_topic_1', 'focus_point_2', 'focus_point_3'], (data) => {
      const focusPoints = [data.focus_topic_1, data.focus_point_2, data.focus_point_3];
      console.log("Retrieved focus points:", focusPoints);

      // Execute content script to get page content
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: getPageContent,
      }, (results) => {
        if (chrome.runtime.lastError) {
          console.error("Scripting Error:", chrome.runtime.lastError.message);
          return;
        }

        const content = results[0]?.result;
        console.log("Page content retrieved:", content);

        // Send data to backend
        fetch('http://localhost:5000/get_response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            focusPoints: focusPoints,
            content: content,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Response from backend:', data);

          // Prepare the pie chart data for the three focus points
          const focus1Percentage = data.focus_point_1_percentage;
          const focus2Percentage = data.focus_point_2_percentage;
          const focus3Percentage = data.focus_point_3_percentage;

          // Create the HTML structure for the popup
          const popupHtml = `
            <html>
            <head>
                <style nonce>
                    * {
                        box-sizing: border-box;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        padding: 20px;
                    }
                    .chart-container {
                        display: flex;
                        justify-content: space-evenly;
                    }
                    .ring-chart {
                        position: relative;
                        width: 100px;
                        height: 100px;
                        margin: 20px;
                        background: conic-gradient(#ff6347 0 ${focus1Percentage}%, #87cefa ${focus1Percentage}% 100%);
                        border-radius: 50%;
                        transition: background 1s ease;
                    }
                    .ring-chart::before {
                        content: '';
                        position: absolute;
                        top: 20px;
                        left: 20px;
                        width: 60px;
                        height: 60px;
                        background: #f0f0f0;
                        border-radius: 50%;
                    }
                    .percentage {
                        font-size: 20px;
                        font-weight: bold;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .chart-container .ring-chart:nth-child(2) {
                        background: conic-gradient(#ff6347 0 ${focus2Percentage}%, #87cefa ${focus2Percentage}% 100%);
                    }
                    .chart-container .ring-chart:nth-child(3) {
                        background: conic-gradient(#ff6347 0 ${focus3Percentage}%, #87cefa ${focus3Percentage}% 100%);
                    }
                </style>
            </head>
            <body>
                <div class="chart-container">
                    <div class="ring-chart">
                        <div class="percentage">${focus1Percentage}%</div>
                    </div>
                    <div class="ring-chart">
                        <div class="percentage">${focus2Percentage}%</div>
                    </div>
                    <div class="ring-chart">
                        <div class="percentage">${focus3Percentage}%</div>
                    </div>
                </div>
            </body>
            </html>
          `;

          chrome.windows.create({
            url: 'data:text/html;charset=utf-8,' + encodeURIComponent(popupHtml),
            type: 'popup',
            width: 400,
            height: 300,
          });
        })
        .catch(error => console.error('Fetch Error:', error));
      });
    });
  }
});

function getPageContent() {
  return document.body.innerText;
}