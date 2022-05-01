
var contextMenuHide = {
    "id": "hide",
    "title": "Add to hidden",
	"contexts": ["link"],
	"documentUrlPatterns": ["https://www.reddit.com/r/*/comments/*/"]
};

var contextMenuBlock = {
    "id": "block",
    "title": "Add to blocked",
	"contexts": ["link"],
	"documentUrlPatterns": ["https://www.reddit.com/r/*/comments/*/"]
};

chrome.tabs.onActivated.addListener( (tab) => {
    chrome.tabs.get(tab.tabId, (current_tab_info) => {
        if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(current_tab_info.url)) {
			chrome.scripting.executeScript({ target: { tabId: tab.tabId }, files: ["js/foreground.js"] });
		} else {
			chrome.storage.sync.remove("onpage");
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(tab.url)) {
		if(tab.status === "complete") {
			chrome.scripting.executeScript({ target: { tabId: tabId }, files: ["js/foreground.js"] });
		}
	} else {
		chrome.storage.sync.remove("onpage");
	}
});

// oninstall default settings

chrome.contextMenus.onClicked.addListener(function (data, tab) {
	const regexp = /^(?:https:\/\/)?(?:www\.)?(?:reddit\.com)?\/?\/?(?:(?:user|u)\/)?([\w-]{3,20})\/?$/;
	if(regexp.test(data.linkUrl)) {
		console.log(data.menuItemId);
		console.log(data.linkUrl);
	} else {
		console.log("Not a user!");
	}
});

chrome.runtime.onInstalled.addListener(function (installData) {
	chrome.contextMenus.create(contextMenuHide);
	chrome.contextMenus.create(contextMenuBlock);

	chrome.storage.sync.set({ "active": true });
	chrome.storage.sync.set({ "userlist": [] });
	chrome.storage.sync.set({ "saved": false });
	chrome.storage.sync.set({ "themeIndex": 0 });
	chrome.storage.sync.set({ "style": "theme-light" });
	chrome.storage.sync.set({ "stickyIndex": 0 });
	chrome.storage.sync.set({ "sticky": "unblocked" });
});