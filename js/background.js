
var contextMenuHide = {
    "id": "hide",
    "title": "Add to hidden",
	"contexts": ["link"],
	"documentUrlPatterns": ["https://www.reddit.com/r/*/comments/*/"],
	"targetUrlPatterns": ["https://www.reddit.com/user/*/"]
};

var contextMenuBlock = {
    "id": "block",
    "title": "Add to blocked",
	"contexts": ["link"],
	"documentUrlPatterns": ["https://www.reddit.com/r/*/comments/*/"],
	"targetUrlPatterns": ["https://www.reddit.com/user/*/"]
};

chrome.tabs.onActivated.addListener( (activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
		if(!/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(tab.url)) {
			chrome.storage.sync.set({ "onpage": [] });
		}
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(!/^https:\/\/www\.reddit\.com\/r\/.*\/comments\/.*/.test(tab.url)) {
		chrome.storage.sync.set({ "onpage": [] });
	}
});

chrome.contextMenus.onClicked.addListener(function (data, tab) {
	let userData = data.linkUrl;
	let statusData = data.menuItemId === "block";

	const regexp = /^(?:https:\/\/)?(?:www\.)?(?:reddit\.com)?\/?\/?(?:(?:user|u)\/)?([\w-]{3,20})\/?$/;
	userData = "/user/" + regexp.exec(userData)[1] + "/";

	chrome.storage.sync.get("userlist", function (result) {
		for(let i = 0; i < result.userlist.length; i++) {
			let key = "user" + i;
			if(userData.toUpperCase() === result.userlist[i][key].user.toUpperCase()) {
				console.log("Unable to add duplicate user");
				return;
			}
		}

		let updatedList = result.userlist;

		let key = "user" + updatedList.length;
		let user = { "status": statusData, "user": userData};
		let newEntry = { [key]: user };

		updatedList.push(newEntry);

		chrome.storage.sync.set({ "userlist": updatedList });

		chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["js/foreground.js"] });
	});
});

chrome.runtime.onInstalled.addListener(function (installData) {
	chrome.contextMenus.create(contextMenuHide);
	chrome.contextMenus.create(contextMenuBlock);

	chrome.storage.sync.set({ "active": true });
	chrome.storage.sync.set({ "userlist": [] });
	chrome.storage.sync.set({ "onpage": [] });
	chrome.storage.sync.set({ "saved": false });

	chrome.storage.sync.set({
		"settings": {
			"ruleIndex": 0,
			"rule": "false",
			"stickyIndex": 0,
			"sticky": "unblocked",
			"autosaveIndex": 0,
			"autosave": "false",
			"themeIndex": 0,
			"theme": "theme-light",
		}
	});
});