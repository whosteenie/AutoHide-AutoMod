﻿
document.getElementById("activate").addEventListener("click", toggleActivate);

function toggleActivate() {

    var images = document.getElementsByClassName("icon");
    for(const image of images) {
        image.classList.toggle("hidden");
    }

    // TODO: update block rules if activated/deactivated
}

document.getElementById("options").addEventListener("click", openOptions);

function openOptions() {
    window.open("chrome-extension://ngoaackofcidlkifepflfpibajaddpae/blocklist.html");
}