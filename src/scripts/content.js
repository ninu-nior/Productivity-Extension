chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContent") {
        const bodyText = document.body.innerText; // Modify as needed to extract specific content
        sendResponse({ content: bodyText });
    }
});
