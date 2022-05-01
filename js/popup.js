
const html = document.getElementById("popup-html");
const topMenu = document.getElementById("popup-top-menu");

var isActivated;
const images = document.getElementsByClassName("icon");
const enabled = document.getElementById("enabled");
const disabled = document.getElementById("disabled");

document.getElementById("activate").addEventListener("click", toggleActivate);
document.getElementById("options").addEventListener("click", openOptions);

loadSettings();

function toggleActivate() {
    isActivated = !isActivated;

    toggleImages();

    chrome.storage.sync.set({ "active": isActivated });
}

// TODO: toggle image on hover and add press animation
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

function loadSettings() {
    chrome.storage.sync.get("active", function (result) {
        isActivated = result.active;

        toggleImages();
	});

	chrome.storage.sync.get("onpage", function (result) {
		if(result.onpage === undefined) {
			console.log("No users on this page!");
			return;
		}

		for(let i = 0; i < result.onpage.length; i++) {
			console.log(result.onpage);
			let status = "";
			if(result.onpage[i].status) {
				status = "img/blocked.svg";
			} else {
				status = "img/expand.svg";
			}

			let table = document.getElementById("blocklist");
			let template = `
                <tr>
					<td><img src=${status} alt="•" class="popup-status"></td>
					<td>${result.onpage[i].user}</td>
				</tr>
                    `;

			table.innerHTML += template;
		}
	});

	chrome.storage.sync.get("theme", function (result) {
		html.classList.add(result.theme);
		topMenu.classList.add(result.theme);
	});
}