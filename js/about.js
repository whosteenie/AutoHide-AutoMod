
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
/* ------------- */

window.addEventListener("resize", hideElements);

loadSettings();

function loadSettings() {
	chrome.storage.sync.get("style", function (result) {
		body.classList.add(result["style"]);
		topMenu.classList.add(result["style"]);
		content.classList.add(result["style"]);
	});
}

function hideElements() {
    let pageTitle = document.getElementsByTagName("h1")[0];

    if(window.innerWidth < 1000) {
		content.classList.add("fixed");
    } else {
        content.classList.remove("fixed");
    }
    if(window.innerWidth < 832) {
		pageTitle.classList.add("hidden");
    } else {
        pageTitle.classList.remove("hidden");
    }
}