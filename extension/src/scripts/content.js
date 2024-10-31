function extractContent() {
    let content = document.body ? document.body.innerText : '';  
    return content;
}

function injectSidebar() {
    console.log("Content script loaded");

    const sidebarFrame = document.createElement('iframe');
    sidebarFrame.style.position = 'fixed';
    sidebarFrame.style.top = '0';
    sidebarFrame.style.right = '0';
    sidebarFrame.style.width = '300px';
    sidebarFrame.style.height = '100%';
    sidebarFrame.style.border = 'none';
    sidebarFrame.style.zIndex = '1000';
    sidebarFrame.src = chrome.runtime.getURL('src/views/sidebar.html');

    document.body.appendChild(sidebarFrame);
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ type: 'content', content: extractContent() });
    injectSidebar();
});
