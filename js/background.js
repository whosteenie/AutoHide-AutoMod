
var contextMenuHide = {
    "id": "hide",
    "title": "Add to hidden",
    "contexts": ["link"]
};

var contextMenuBlock = {
    "id": "block",
    "title": "Add to blocked",
    "contexts": ["link"]
};

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
	if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(tab.url)) {
		chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["js/foreground.js"] });

		if(tab.status === "complete") {
			chrome.contextMenus.removeAll();
			chrome.contextMenus.create(contextMenuHide);
			chrome.contextMenus.create(contextMenuBlock);
		}
	} else {
		chrome.contextMenus.removeAll();
		chrome.storage.sync.remove("onpage");
	}
});