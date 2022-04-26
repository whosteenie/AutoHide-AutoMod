
var pageBlocked = 0;

var comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4");
var commentsList = comments[0].children;

loadSettings();

function loadSettings() {
    chrome.storage.sync.get(["entries"], function (result) {
        for(let i = 0; i < result.entries; i++) {
            let key = "user" + i;

            chrome.storage.sync.get([key], function (result) {
                let user = result[key].user;
                let status = result[key].status;
                blockUsers(user, status);
            });
        }
    });
}

function blockUsers(user, status) {
    for(let i = 0; i < commentsList.length; i++) {
        if(isHidden(commentsList[i], user) && status) {
            commentsList[i].style.display = "none";
        } else {
            commentsList[i].removeAttribute("style");
        }
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