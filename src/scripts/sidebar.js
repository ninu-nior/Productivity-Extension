// sidebar.js
document.addEventListener('DOMContentLoaded', () => {
    // Get the message and results passed from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'showResults') {
            const { results, message } = request.data;

            // Populate the results in the sidebar
            const resultsContainer = document.getElementById('results-container');
            results.forEach(result => {
                const p = document.createElement('p');
                p.textContent = `${result.focusPoint}: ${result.percentage}%`;
                resultsContainer.appendChild(p);
            });

            // Display the encouraging message
            document.getElementById('encouraging-message').innerText = message;
        }
    });

    // Close button functionality
    document.getElementById('close-btn').addEventListener('click', () => {
        // Remove sidebar from the DOM
        document.querySelector('.sidebar-container').remove();
    });
});
