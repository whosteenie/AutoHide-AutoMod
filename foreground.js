
// TODO: this is a test blocklist, implement custom blocklists
var blocklist = ["/user/AutoModerator/", "/user/a-mirror-bot/", "/user/DnANZ/"];

// TODO: implement user settings for block/hide preferences
var canBlock = false;

comments = document.getElementsByClassName("_1YCqQVO-9r-Up6QPB9H6_4 _1YCqQVO-9r-Up6QPB9H6_4");
commentsList = comments[0].children;

for(let i = 0; i < commentsList.length; i++) {
    if(isHidden(commentsList[i]) && canBlock) {
        commentsList[i].remove();
        i--;
    }
}

// TODO: attempting to hide a child comment hides the parent comment instead
function isHidden(comment) {
    for(const user of blocklist) {
        if(comment.querySelector("[href='" + user + "']")) {
            comment.querySelector("[class='threadline']")?.click();
            return true;
        }
    }

    return false;
}