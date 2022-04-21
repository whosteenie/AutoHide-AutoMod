
// TODO: changes only occur when tab is switched to, update page when url is loaded

//chrome.tabs.onActivated.addListener(tab => {
//    chrome.tabs.get(tab.tabId, current_tab_info => {
//        if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(current_tab_info.url)) {
//            chrome.scripting.executeScript({ target: {tabId: tab.tabId}, files: ["foreground.js"] });
//        }
//    });
//});

// TEMP: readability
chrome.tabs.onActivated.addListener(
    tab =>
    {
        chrome.tabs.get(tab.tabId, current_tab_info =>
        {
            if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(current_tab_info.url))
            {
                chrome.scripting.executeScript({ target: { tabId: tab.tabId }, files: ["foreground.js"] });
            }
        });
    });

// TODO: add blocklist context menu item
/*
chrome.contextMenus.create({
    title: "Add to blocklist"
})
*/