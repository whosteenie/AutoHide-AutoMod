
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
        isActivated = result["active"];

        toggleImages();
    });
}