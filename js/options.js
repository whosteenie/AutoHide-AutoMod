
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
let title = document.getElementsByTagName("h1")[0];
/* ------------- */

let darkMode = document.getElementById("dark-mode");
let ruleSelect = document.getElementById("rule");
let ruleOptions = ruleSelect.options;
let stickySelect = document.getElementById("sticky");
let stickyOptions = stickySelect.options;
let themeSelect = document.getElementById("theme");
let themeOptions = themeSelect.options;
let warning = document.getElementById("warning");

window.addEventListener("resize", hideElements);
document.addEventListener('keydown', e => {
	if(e.ctrlKey && e.key === 's') {
		e.preventDefault();
		saveSettings();
	}
});

document.getElementById("save-options").addEventListener("click", saveSettings);

loadSettings();
hideElements();

function loadSettings() {
	chrome.storage.sync.get("ruleIndex", function (result) {
		ruleSelect.value = ruleOptions[result.ruleIndex].value;
	});

	chrome.storage.sync.get("stickyIndex", function (result) {
		stickySelect.value = stickyOptions[result.stickyIndex].value;
	});

	chrome.storage.sync.get("themeIndex", function (result) {
		let currTheme = themeOptions[result.themeIndex].value

		themeSelect.value = currTheme;
		body.classList.add(currTheme);
		topMenu.classList.add(currTheme);
		content.classList.add(currTheme);
		title.classList.add(currTheme);
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
	let ruleIndex = ruleSelect.selectedIndex;
	let rule = ruleOptions[ruleIndex].value;
	chrome.storage.sync.set({ "ruleIndex": ruleIndex });
	chrome.storage.sync.set({ "rule": rule });

	let stickyIndex = stickySelect.selectedIndex;
	let sticky = stickyOptions[stickyIndex].value;
	chrome.storage.sync.set({ "stickyIndex": stickyIndex });
	chrome.storage.sync.set({ "sticky": sticky });

	let themeIndex = themeSelect.selectedIndex;
	let theme = themeOptions[themeIndex].value;
	chrome.storage.sync.set({ "theme": theme });
	chrome.storage.sync.set({ "themeIndex": themeIndex });

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