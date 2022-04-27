
var isActivated;

var pageBlocked = 0;

var comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4");
var commentsList = comments[0].children;

chrome.storage.sync.get("active", function (result) {
    isActivated = result["active"];

    if(isActivated) {
        loadSettings();
    }
});

chrome.contextMenus.onClicked();

function loadSettings() {
	chrome.storage.sync.get(["userlist"], function (result) {
		for(let i = 0; i < result.userlist.length; i++) {
			let key = "user" + i;
			let user = result.userlist[i][key].user;
			let status = result.userlist[i][key].status;

            blockUsers(user, status);
		}
	});
}

// TODO: since extension runs onActivated, unhidden comments will be
//       hidden after first automatic hide event
function blockUsers(user, status) {
    shouldScroll = window.scrollY === 0 && window.scrollX === 0;

    for(let i = 0; i < commentsList.length; i++) {
        if(isHidden(commentsList[i], user)) {
            if(status) {
                commentsList[i].style.display = "none";
            } else {
                commentsList[i].removeAttribute("style");
            }
        }
    }

    if(shouldScroll) {
        window.scrollTo(0, 0);
    }
}

function isHidden(comment, user) {
    if(comment.querySelector("[href='" + user + "' i]")) {
        let level = comment.getElementsByClassName("_1RIl585IYPW6cmNXwgRz0J")[0].innerHTML;
        level = parseInt(level.replace(/^\D+/g, ""), 10) - 1;

        let threadlines = comment.querySelectorAll(".threadline");
        threadlines[level]?.click();

        pageBlocked++;
        return true;
    }

    return false;
}