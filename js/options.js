
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
let title = document.getElementsByTagName("h1")[0];
/* ------------- */

let ruleSelect = document.getElementById("rule");
let ruleOptions = ruleSelect.options;
let stickySelect = document.getElementById("sticky");
let stickyOptions = stickySelect.options;
let autosaveSelect = document.getElementById("autosave");
let autosaveOptions = autosaveSelect.options;
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
	chrome.storage.sync.get("settings", function (result) {
		let settings = result.settings;

		ruleSelect.value = ruleOptions[settings.ruleIndex].value;
		stickySelect.value = stickyOptions[settings.stickyIndex].value;
		autosaveSelect.value = autosaveOptions[settings.autosaveIndex].value;

		let currTheme = themeOptions[settings.themeIndex].value;

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

	let stickyIndex = stickySelect.selectedIndex;
	let sticky = stickyOptions[stickyIndex].value;

	let autosaveIndex = autosaveSelect.selectedIndex;
	let autosave = autosaveOptions[autosaveIndex].value;

	let themeIndex = themeSelect.selectedIndex;
	let theme = themeOptions[themeIndex].value;

	chrome.storage.sync.set({
		"settings": {
			"ruleIndex": ruleIndex,
			"rule": rule,
			"stickyIndex": stickyIndex,
			"sticky": sticky,
			"autosaveIndex": autosaveIndex,
			"autosave": autosave,
			"themeIndex": themeIndex,
			"theme": theme,
		}
	});

	chrome.storage.sync.set({ "saved": true });

	location.reload();
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