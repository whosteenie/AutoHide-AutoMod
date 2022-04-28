
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
			return;
		}

		for(const index of result.onpage) {
			chrome.storage.sync.get("userlist", function (result) {
				let key = "user" + index;

				let status = "";
				if(result.userlist[index][key].status) {
					status = "img/blocked.png";
				} else {
					status = "img/expand.png"
				}

				let table = document.getElementById("blocklist");
				let template = `
                <tr>
					<td><img src=${status} alt="•" class="popup-status"></td>
					<td>${result.userlist[index][key].user}</td>
				</tr>
                    `;

				table.innerHTML += template;
			});
		}
	});

	chrome.storage.sync.get("style", function (result) {
		html.classList.add(result.style);
		topMenu.classList.add(result.style);
	});
}