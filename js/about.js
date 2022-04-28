
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
	chrome.storage.sync.get("style", function (result) {
		body.classList.add(result.style);
		topMenu.classList.add(result.style);
		content.classList.add(result.style);
		title.classList.add(result.style);

		if(result.style === "style-dark") {
			document.getElementById("github").src = "/img/github_light.png";
		} else {
			document.getElementById("github").src = "/img/github_dark.png";
		}
	});
}

function hideElements() {
	let statusImages = document.getElementsByClassName("status");

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

	let statusHead = document.getElementById("head-status");

	for(const image of statusImages) {
		if(window.innerWidth < 650) {
			image.classList.add("hidden");
			table.style.width = "480px";
			statusHead.style.width = "100px";
			statusHead.innerHTML = "Status";
		} else {
			image.classList.remove("hidden");
			table.removeAttribute("style");
			statusHead.removeAttribute("style");
			statusHead.innerHTML = "Status: Hidden / Blocked";
		}
	}
}