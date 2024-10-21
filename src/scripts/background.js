chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      
      // Send message to the content script to analyze the active tab's content
      chrome.tabs.sendMessage(activeTab.id, { message: 'scrapeContent' });
    });
  });
  