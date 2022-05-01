
var pageBlocked = [];

var comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4");
var commentsList = comments[0]?.children;

chrome.storage.sync.get("active", function (result) {
    if(result.active) {
		loadSettings();
	}
});

function loadSettings() {
	chrome.storage.sync.get(["userlist"], function (result) {
		blockUsers(null, null, result.userlist);

		for(let i = 0; i < result.userlist.length; i++) {
			let key = "user" + i;
			let user = result.userlist[i][key].user;
			let status = result.userlist[i][key].status;

			blockUsers(user, status, result.userlist);
		}
	});
}

function blockUsers(user, status, userlist) {
	let users = [];
	for(let i = 0; i < userlist.length; i++) {
		let key = "user" + i;
		users.push(userlist[i][key].user);
	}

	chrome.storage.sync.get("sticky", function (result) {
		for(let i = 0; i < commentsList.length; i++) {
			let userElement = commentsList[i].querySelector("[data-testid='comment_author_link']");
			let currName = userElement?.getAttribute("href");
			let isDuplicate = users.includes(currName);
			let stickyStatus = (result.sticky === "true");

			if(isHidden(commentsList[i], user, result.sticky)) {
				if(status || (stickyStatus && !isDuplicate)) {
					commentsList[i].style.display = "none";
				} else {
					commentsList[i].removeAttribute("style");
				}

				if(user === null && !isDuplicate) {
					let entry = { "user": currName, "status": stickyStatus };
					pageBlocked.push(entry);
				} else if(user !== null) {
					let entry = { "user": user, "status": status };
					pageBlocked.push(entry);
				}
			}
		}

		chrome.storage.sync.set({ ["onpage"]: pageBlocked });
	});
}

function isHidden(comment, user, sticky) {

	let userElement = comment.querySelector("[data-testid='comment_author_link']");
	let currName = userElement?.getAttribute("href");
	if(userElement === null || currName === null) {
		return false;
	}
	let shouldHide = user === currName;

	let stickyClass = "_2ETuFsVzMBxiHia6HfJCTQ _2wd-K5Djdc9TGPRGDgmkpX"
	let isStickied = comment.querySelector("[class='" + stickyClass + "' i]") !== null;
	let hideSticky = sticky === "false" || sticky === "true";

	if(shouldHide || (isStickied && hideSticky && user === null)) {
		let threadContainer = comment.getElementsByClassName("_1DooEIX-1Nj5rweIc5cw_E")[0];
		threadContainer.getElementsByClassName("_3Wv3am0TXfTcugZJ6niui")[0]?.remove();

		let expandContainer = comment.getElementsByClassName("_1nGapmdexvR0BuOkfAi6wa")[0];
		expandContainer.classList?.remove("_1zN1-lYh2LfbYOMAho_O8g");
		expandContainer.classList.add("O_Ica0k2O4KFcZyNfsJDU");

		comment.getElementsByClassName("_3cjCphgls6DH-irkVaA0GM")[0]?.remove();
		comment.getElementsByClassName("_3KgrO85L1p9wQbgwG27q4y")[0]?.remove();

		comment.getElementsByClassName("_1z5rdmX8TDr6mqwNv7A70U")[0].classList.add("hovered");

		comment.getElementsByClassName("_3tw__eCCe7j-epNCKGXUKk")[0].classList.add("undefined");

		return true;
	}

	return false;
}



// This old way of hiding a comment makes more sense
// and is less error prone, but it causes an automatic
// scrolling to the hidden comment every time the
// page is loaded.

//function isHiddenOld(comment, user, sticky) {

//	let userElement = comment.querySelector("[data-testid='comment_author_link']");
//	let currName = userElement?.getAttribute("href");
//	if(userElement === null || currName === null) {
//		return false;
//	}
//	let shouldHide = user === currName;

//	let stickyClass = "_2ETuFsVzMBxiHia6HfJCTQ _2wd-K5Djdc9TGPRGDgmkpX"
//	let isStickied = comment.querySelector("[class='" + stickyClass + "' i]") !== null;
//	let hideSticky = sticky === "false" || sticky === "true";

//	if(shouldHide || (isStickied && hideSticky && user === null)) {
//		let level = comment.getElementsByClassName("_1RIl585IYPW6cmNXwgRz0J")[0].innerHTML;
//		level = parseInt(level.replace(/^\D+/g, ""), 10) - 1;

//		let threadlines = comment.querySelectorAll(".threadline");
//		threadlines[level]?.click();

//		return true;
//	}

//	return false;
//}