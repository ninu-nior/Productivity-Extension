document.getElementById('set-focus-btn').addEventListener('click', () => {
  // Get user input for focus points
  const focusInputs = document.querySelectorAll('.focus-input');
  const focus_topic_1 = focusInputs[0].value;
  const focus_point_2 = focusInputs[1].value;
  const focus_point_3 = focusInputs[2].value;

  // Dummy logic for demonstration; replace with your fetch to the server
  const results = [
      { focusPoint: focus_topic_1, percentage: 80 },
      { focusPoint: focus_point_2, percentage: 60 },
      { focusPoint: focus_point_3, percentage: 40 },
  ];
  const encouragingMessage = "You're doing great! Keep it up!";

  // Inject the sidebar HTML into the current webpage
  fetch(chrome.runtime.getURL('sidebar.html'))
      .then(response => response.text())
      .then(data => {
          const div = document.createElement('div');
          div.innerHTML = data;
          document.body.appendChild(div);

          // Send message to the sidebar
          const sidebar = div.querySelector('.sidebar-container');
          sidebar.dispatchEvent(new CustomEvent('showResults', {
              detail: {
                  results: results,
                  message: encouragingMessage
              },
              bubbles: true
          }));
      });
});
