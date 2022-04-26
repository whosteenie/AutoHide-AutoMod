
var contextMenuHide = {
    "id": "hide",
    "title": "Add to hidden",
    "contexts": ["link"],
    "onclick": customBlock()
};

var contextMenuBlock = {
    "id": "block",
    "title": "Add to blocked",
    "contexts": ["link"],
    "onclick": customBlock()
};

// TEMP: readability
chrome.tabs.onActivated.addListener(
    tab =>
    {
        chrome.tabs.get(tab.tabId, current_tab_info =>
        {
            if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(current_tab_info.url)) {
                chrome.scripting.executeScript({ target: { tabId: tab.tabId }, files: ["js/foreground.js"] });
                chrome.contextMenus.create(contextMenuHide);
                chrome.contextMenus.create(contextMenuBlock);
            } else {
                chrome.contextMenus.remove("hide");
                chrome.contextMenus.remove("block");
            }
        });
    });

// TODO: add blocklist context menu item

function customBlock() {
    console.log("add blockrule");
}