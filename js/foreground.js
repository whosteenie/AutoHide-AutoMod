
var blockIndex = null;
var pageBlocked = [];

var stickyClass = "_2ETuFsVzMBxiHia6HfJCTQ _2wd-K5Djdc9TGPRGDgmkpX";
var comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4")[0];
var commentsList = comments?.children;

chrome.storage.sync.get("active", function (result) {
	if(result.active) {
		loadSettings();
	}
});

function loadSettings() {
	chrome.storage.sync.get("userlist", function (result) {
		userBlock(result.userlist, true);
		userBlock(result.userlist, false);
	});
}

function userBlock(userlist, stickies) {
	chrome.storage.sync.get("settings", function (result) {
		// should you hide or block stickies, or neither
		let settings = result.settings;
		let stickyStatus = null;
		if(settings.sticky !== "unblocked") {
			stickyStatus = (settings.sticky === "true");
		}

		// go through all the comments on the page
		for(let i = 0; i < commentsList.length; i++) {
			// create a list of raw blocked usernames
			let users = [];
			for(let i = 0; i < userlist.length; i++) {
				let key = "user" + i;
				users.push(userlist[i][key].user);
			}

			// is there overlap between blocklist and sticky rule?
			let userElement = commentsList[i].querySelector("[data-testid='comment_author_link']");
			let currName = userElement?.getAttribute("href");
			if(userElement === null || currName === null) {
				continue;
			}

			let isDuplicate = users.includes(currName);

			// should you hide this user?
			if(isHidden(users, commentsList[i], stickyStatus)) {
				// get the status of this successful block
				let key = "user" + blockIndex;
				let status = userlist[blockIndex][key].status;

				// block or hide for blocklist and stickies
				if(status || (stickyStatus && !isDuplicate)) {
					commentsList[i].style.display = "none";
				} else {
					commentsList[i].removeAttribute("style");
				}

				// add to popup list for blocklist and stickies
				if(stickies && !isDuplicate) {
					let entry = { "user": currName, "status": stickyStatus };
					pageBlocked.push(entry);
				} else if(!stickies) {
					let entry = { "user": currName, "status": status };
					pageBlocked.push(entry);
				}
			}

			// if you've blocked as many people as are on the blocklist, then stop searching
			if(pageBlocked.length >= userlist.length) {
				break;
			}
		}

		// update popup list
		chrome.storage.sync.set({ "onpage": pageBlocked });
	});
}

function isHidden(users, comment, sticky) {
	let userElement = comment.querySelector("[data-testid='comment_author_link']");
	let currName = userElement.getAttribute("href");

	let shouldHide = users.includes(currName);

	let isStickied = comment.querySelector("[class='" + stickyClass + "' i]") !== null;
	let hideSticky = sticky;

	if(shouldHide || (isStickied && hideSticky)) {
		blockIndex = users.indexOf(currName);

		let level = comment.getElementsByClassName("_1RIl585IYPW6cmNXwgRz0J")[0].innerHTML;
		level = parseInt(level.replace(/^\D+/g, ""), 10) - 1;

		let threadlines = comment.querySelectorAll(".threadline");
		threadlines[level]?.click();

		return true;
	}

	return false;
}