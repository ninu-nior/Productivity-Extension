chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Retrieve stored focus points
    chrome.storage.local.get(['focus_topic_1', 'focus_point_2', 'focus_point_3'], (data) => {
      const focusPoints = [
        { name: data.focus_topic_1 || 'Focus Point 1', value: data.focus_topic_1 },
        { name: data.focus_point_2 || 'Focus Point 2', value: data.focus_point_2 },
        { name: data.focus_point_3 || 'Focus Point 3', value: data.focus_point_3 }
      ];
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
            focusPoints: focusPoints.map(fp => fp.value),
            content: content,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Response from backend:', data);

          // Prepare the HTML structure for the popup with embedded styles
          const popupHtml = `
            <html>
            <head>
                <style nonce>
                    * {
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Poppins', sans-serif;
                        background-color: #ffffff;
                        padding: 20px;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                    }

                    .chart-container {
                        display: flex;
                        justify-content: space-evenly;
                        width: 100%;
                    }
                    .chart {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 30%;
                    }
                    .ring-chart {
                        position: relative;
                        width: 70%;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        transition: background 1s ease;
                    }
                    .ring-chart::before {
                        content: '';
                        position: absolute;
                        top: 15%;
                        left: 15%;
                        width: 70%;
                        height: 70%;
                        background: #f0f0f0;
                        border-radius: 50%;
                    }
                    .percentage {
                        font-family: 'Poppins';
                        font-size: 1.1rem;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                    .chart-label {
                        font-size: 0.8rem;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                    .message {
                        font-family: 'Poppins';
                        font-size: 0.9rem;
                        color: #666;
                        margin-top: 1px;
                    }
                    .space {
                        height: 6%;
                    }
                    .space2 {
                        height: 1%;
                    }
                    .todo-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                    }
                    .todo-icon {
                        width: 0;
                        height: 0;
                        border-left: 12px solid transparent;
                        border-right: 12px solid transparent;
                        border-bottom: 20px solid rgb(229, 177, 74);
                        position: relative;
                        margin-right: 10px;
                    }
                    .todo-icon::after {
                        content: "";
                        width: 0;
                        height: 0;
                        border-left: 12px solid transparent;
                        border-right: 12px solid transparent;
                        border-top: 20px solid white;
                        position: absolute;
                        top: 100%;
                        left: -12px;
                    }
                </style>
            </head>
            <body>
                <div class="chart-container">
                    ${focusPoints.map((fp, index) => `
                        <div class="chart" id="chart-${index}">
                            <div class="ring-chart" id="ring-chart-${index}">
                                <div class="percentage">${data[`focus_point_${index + 1}_percentage`]}%</div>
                            </div>
                            <div class="chart-label">${fp.name}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="space"></div>
                <div class="todo-item">
                    <div class="todo-icon"></div>                    
                </div>
                <div class="message">${data.message}</div>
                <script nonce>
                    const focusData = ${JSON.stringify([
                        { percentage: data.focus_point_1_percentage, completedColor: '#e05b5b', remainingColor: '#0d1b2a' },
                        { percentage: data.focus_point_2_percentage, completedColor: '#0096c7', remainingColor: '#0d1b2a' },
                        { percentage: data.focus_point_3_percentage, completedColor: '#E5B14A', remainingColor: '#0d1b2a' }
                    ])};

                    focusData.forEach((fd, index) => {
                        const chart = document.getElementById('ring-chart-' + index);
                        chart.style.background = \`conic-gradient(\${fd.completedColor} 0 \${fd.percentage}%, \${fd.remainingColor} \${fd.percentage}% 100%)\`;
                    });
                </script>
            </body>
            </html>
          `;

          // Open the popup with the generated HTML
          chrome.windows.create({
            url: 'data:text/html;charset=utf-8,' + encodeURIComponent(popupHtml),
            type: 'popup',
            width: 400,
            height: 300,
          }, (window) => {
            // Automatically close the popup after 20 seconds
            setTimeout(() => {
              chrome.windows.remove(window.id);
            }, 10000); // 20000 milliseconds = 20 seconds
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
