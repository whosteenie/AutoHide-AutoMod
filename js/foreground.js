
var blockIndex = null;
var pageBlocked = [];

var stickyClass = "_2ETuFsVzMBxiHia6HfJCTQ _2wd-K5Djdc9TGPRGDgmkpX";

var comments = document.querySelector("._1YCqQVO-9r-Up6QPB9H6_4");
var commentsList = Array.from?.(comments?.children);
var commentsTotal = commentsList;

docReady();

function docReady() {
	if(document.readyState === "complete") {
		setTimeout(isActive, 1);
	} else {
		document.addEventListener("DOMContentLoaded", isActive);
	}
}

function buildList() {
	let newComments = document.querySelector("._1YCqQVO-9r-Up6QPB9H6_4");
	let newList = Array.from(newComments?.children);

	commentsList = newList.filter(entry => !commentsTotal.includes(entry));
	commentsTotal.push(...newList);

	window.removeEventListener("scroll", buildList);
	loadSettings();
}

function isActive() {
	chrome.storage.sync.get("active", function (result) {
		if(result.active) {
			loadSettings();
		}
	});
}

function loadSettings() {
	chrome.storage.sync.get("userlist", function (result) {
		blockUsers(result.userlist);
	});
}

function blockUsers(userlist) {
	chrome.storage.sync.get("settings", function (result) {
		// should you hide or block stickies, or neither
		let settings = result.settings;
		let stickyStatus = null;
		if(settings.sticky !== "unblocked") {
			stickyStatus = (settings.sticky === "true");
		}

		// create a list of raw blocked usernames
		let users = [];
		for(let i = 0; i < userlist.length; i++) {
			let key = `user${i}`;
			users.push(userlist[i][key].user);
		}

		// go through all the comments on the page
		for(let i = 0; i < commentsList.length; i++) {
			// get the current comment container
			let userElement = commentsList[i].querySelector(`[data-testid="comment_author_link"]`);
			// more reply divs will be given an event listener and skipped
			if(userElement === null) {
				commentsList[i].addEventListener("click", loadSettings);
				continue;
			}
			// get the current username of the current comment
			let currName = userElement.getAttribute("href");

			// is there overlap between blocklist and sticky rule?
			let isDuplicate = users.includes(currName);

			// should you hide this user?
			if(isHidden(users, commentsList[i], stickyStatus)) {
				// get the status of this successful block
				let key = `user${blockIndex}`;
				let status = userlist[blockIndex]?.[key].status;

				// block or hide for blocklist and stickies
				if(status || (stickyStatus && !isDuplicate)) {
					commentsList[i].style.display = "none";
				} else {
					commentsList[i].removeAttribute("style");
				}

				// add to popup list for blocklist and stickies
				if(isDuplicate) {
					let entry = { "user": currName, "status": status };
					pageBlocked.push(entry);
				} else {
					let entry = { "user": currName, "status": stickyStatus };
					pageBlocked.push(entry);
				}

				// if you've blocked as many people as are on the blocklist, then stop searching
				if(pageBlocked.length >= userlist.length) {
					// update popup list
					chrome.storage.sync.set({ "onpage": pageBlocked });
					return;
				}
			}
		}

		window.addEventListener("scroll", buildList);
	});
}

function isHidden(users, comment, sticky) {
	let userElement = comment.querySelector(`[data-testid="comment_author_link"]`);
	let currName = userElement.getAttribute("href");

	let shouldHide = users.includes(currName);

	let isStickied = comment.querySelector(`[class="${stickyClass}"]`) !== null;

	if(shouldHide || (isStickied && (sticky !== null))) {
		blockIndex = users.indexOf(currName);

		let level = comment.getElementsByClassName("_1RIl585IYPW6cmNXwgRz0J")[0].innerHTML;
		level = parseInt(level.replace(/^\D+/g, ""), 10) - 1;

		let threadlines = comment.querySelectorAll(".threadline");
		threadlines[level]?.click();

		return true;
	}

	return false;
}