
// TODO: this is a test blocklist, implement loading custom blocklists
var blocklist = ["/user/AutoModerator/", "/user/a-mirror-bot/", "/user/DnANZ/"];

var pageBlocked = 0;

// TODO: implement user settings for block/hide preferences
var canBlock = false;

var comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4");
var commentsList = comments[0].children;

blockUsers();

function blockUsers() {
    for(let i = 0; i < commentsList.length; i++) {
        if(isHidden(commentsList[i]) && canBlock) {
            commentsList[i].style.display = "none";
        }
    }

    // TODO: only add this when transferred to onupdate, and blocking scrolls for the user
    //window.scrollTo(0, 0);

    // TODO: extension icon badge to display how many users are blocked on the current page
    //if(pageBlocked > 999) {
    //    chrome.action.setBadgeText({"text": "999" + "+"});
    //} else {
    //    chrome.action.setBadgeText({"text": pageBlocked.toString()});
    //}
}

function isHidden(comment) {
    for(const user of blocklist) {
        if(comment.querySelector("[href='" + user + "' i]")) {
            let level = comment.getElementsByClassName("_1RIl585IYPW6cmNXwgRz0J")[0].innerHTML;
            level = parseInt(level.replace(/^\D+/g, ""), 10) - 1;

            let threadlines = comment.querySelectorAll("[class='threadline']");
            threadlines[level]?.click();

            pageBlocked++;
            return true;
        }
    }

    return false;
}