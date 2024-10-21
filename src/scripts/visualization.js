function createPieChart(score) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const data = {
      labels: ['Relevant', 'Not Relevant'],
      datasets: [
        {
          label: 'Relevance',
          data: [score, 100 - score],
          backgroundColor: ['#4caf50', '#f44336']
        }
      ]
    };
  
    new Chart(ctx, {
      type: 'pie',
      data: data
    });
  
    document.body.appendChild(canvas);
  }
  
  // Example usage
  chrome.storage.local.get(['relevanceScore'], (result) => {
    createPieChart(result.relevanceScore);
  });
  