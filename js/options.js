
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
/* ------------- */

let darkMode = document.getElementById("dark-mode");

window.addEventListener("resize", hideElements);

document.getElementById("save").addEventListener("click", saveSettings);

loadSettings();

function loadSettings() {
	chrome.storage.sync.get("style", function (result) {
		body.classList.add(result["style"]);
		topMenu.classList.add(result["style"]);
		content.classList.add(result["style"]);

		darkMode.checked = result["style"] === "style-dark";
	});
}

function saveSettings() {
	//chrome.storage.sync.clear();

	let style = "";

	if(darkMode.checked) {
		style = "style-dark"
	} else {
		style = "style-light";
	}

	chrome.storage.sync.set({ "style": style });

	location.reload();
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