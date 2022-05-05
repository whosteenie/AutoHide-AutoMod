
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
let title = document.getElementsByTagName("h1")[0];
/* ------------- */

window.addEventListener("resize", hideElements);

loadSettings();
hideElements();

function loadSettings() {
	chrome.storage.sync.get("settings", function (result) {
		let settings = result.settings;

		body.classList.add(settings.theme);
		topMenu.classList.add(settings.theme);
		content.classList.add(settings.theme);
		title.classList.add(settings.theme);

		if(settings.theme === "theme-dark") {
			document.getElementById("github").src = "/img/github_light.svg";
		} else {
			document.getElementById("github").src = "/img/github_dark.svg";
		}
	});
}

function hideElements() {
	if(window.innerWidth < 1000) {
		content.classList.add("fixed");
	} else {
		content.classList.remove("fixed");
	}
	if(window.innerWidth < 874) {
		title.classList.add("hidden");
	} else {
		title.classList.remove("hidden");
	}
}