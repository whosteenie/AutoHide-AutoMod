
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
let title = document.getElementsByTagName("h1")[0];
/* ------------- */

let darkMode = document.getElementById("dark-mode");
let warning = document.getElementById("warning");

window.addEventListener("resize", hideElements);
document.addEventListener('keydown', e => {
	if(e.ctrlKey && e.key === 's') {
		e.preventDefault();
		saveSettings();
	}
});

document.getElementById("save").addEventListener("click", saveSettings);

loadSettings();
hideElements();

function loadSettings() {
	chrome.storage.sync.get("style", function (result) {
		body.classList.add(result.style);
		topMenu.classList.add(result.style);
		content.classList.add(result.style);
		title.classList.add(result.style);

		darkMode.checked = result.style === "style-dark";
	});

	chrome.storage.sync.get("saved", function (result) {
		if(result.saved) {
			warning.style.color = "green";
			warning.innerHTML = "Saved settings";
			chrome.storage.sync.set({ "saved": false });
		}
	});
}

function saveSettings() {
	let style = "";

	if(darkMode.checked) {
		style = "style-dark";
	} else {
		style = "style-light";
	}

	chrome.storage.sync.set({ "style": style });
	chrome.storage.sync.set({ "saved": true });

	location.reload();
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