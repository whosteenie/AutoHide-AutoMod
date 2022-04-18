
chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        if (/^https:\/\/www\.reddit/.test(current_tab_info.url)) {
            chrome.scripting.executeScript({ target: { tabId: tab.tabId }, files: ['foreground.js'] }, () => console.log('i injected'));
        }
    });
});