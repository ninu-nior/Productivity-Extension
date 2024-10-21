// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'scrapeContent') {
      const pageText = document.body.innerText;
  
      // Get the focus topic from storage
      chrome.storage.local.get(['focusTopic'], (result) => {
        const focusTopic = result.focusTopic;
  
        if (focusTopic) {
          // Analyze the relevance of the current page's content
          const relevanceScore = calculateRelevance(pageText, focusTopic);
  
          // Send the score to the visualization component
          showRelevance(relevanceScore);
        }
      });
    }
  });
  
  // Basic relevance check using keyword matching (this can be replaced with more complex NLP models)
  function calculateRelevance(content, topic) {
    const words = topic.split(/\s+/);
    let count = 0;
  
    words.forEach((word) => {
      if (content.includes(word)) {
        count++;
      }
    });
  
    return (count / words.length) * 100;  // Return relevance as a percentage
  }
  
  // Show relevance via a notification or sidebar (this can be customized)
  function showRelevance(score) {
    const message = score > 50 ? 'Good focus!' : 'You are getting distracted!';
    alert('Relevance score: ' + score + '%. ' + message);
  }
  