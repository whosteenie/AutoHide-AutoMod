
const html = document.getElementById("popup-html");
const topMenu = document.getElementById("popup-top-menu");
const table = document.getElementById("blocklist");
const body = table.getElementsByTagName("tbody")[0];

const enabled = document.getElementById("enabled");
const disabled = document.getElementById("disabled");
let isActivated = true;

document.getElementById("activate").addEventListener("click", toggleActivate);
document.getElementById("options").addEventListener("click", openOptions);

loadSettings();

function toggleActivate() {
    isActivated = !isActivated;

    toggleImages();

    chrome.storage.sync.set({ "active": isActivated });
}

function toggleImages() {
    if(isActivated) {
        enabled.classList?.remove("hidden");
        disabled.classList.add("hidden");
    } else {
        disabled.classList?.remove("hidden");
        enabled.classList.add("hidden");
    }
}

function openOptions() {
    window.open("/blocklist.html");
}

function detectBlocks() {
	chrome.storage.sync.get("onpage", function (result) {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
			let url = tabs[0].url;

			let status = "";
			let display = "";

			for(let i = -1; i < result.onpage.length; i++) {
				if(result.onpage.length === 0) {
					let correctUrl = /^https:\/\/www\.reddit\.com\/.*$/.test(url);

					if(!correctUrl) {
						display = "Not on Reddit!";
					} else {
						display = "No users on this page!";
					}

					status = "img/warning.png";
				} else if(i > -1) {
					if(result.onpage[i].status) {
						status = "img/blocked.svg";
					} else {
						status = "img/expand.svg";
					}

					display = result.onpage[i].user;
				} else {
					continue;
				}

				let template = `
					<tr>
						<td><img src=${status} alt="•" class="popup-status"></td>
						<td>${display}</td>
					</tr>
                    `;

				body.innerHTML += template;
			}
		});
	});
}


function loadSettings() {
	chrome.storage.sync.get("active", function (result) {
		isActivated = result.active;

		toggleImages();
	});

	detectBlocks();

	chrome.storage.sync.get("settings", function (result) {
		let settings = result.settings;

		html.classList.add(settings.theme);
		topMenu.classList.add(settings.theme);
	});
}