
const filter = document.getElementById("filter");
const groupStatus = document.getElementById("group-status");
const table = document.getElementById("blocklist");
const userlist = document.getElementsByClassName("user");
const blockRule = document.getElementById("block-rule");
const warning = document.getElementById("alert");
let checks = document.getElementsByClassName("select");
let toggles = document.querySelectorAll("input.toggle");
let groupSelect = document.getElementById("select-all");
let currSort = "time";

document.addEventListener("DOMContentLoaded", loadSettings);
window.addEventListener("resize", hideElements);

filter.addEventListener("keyup", filterList);
groupStatus.addEventListener("click", toggleSelected);

blockRule.addEventListener("keydown", (e) => { if(e.code === "Enter") { validateInput(); } });
document.getElementById("add").addEventListener("click", validateInput);
document.getElementById("remove").addEventListener("click", removeBlock);

document.getElementById("save").addEventListener("click", saveSettings);

addInputs();

// TODO: not a very efficient way to check which header is clicked
document.getElementById("head-check").addEventListener("click", sortTable);
document.getElementById("head-user").addEventListener("click", sortTable);
document.getElementById("head-status").addEventListener("click", sortTable);

// TODO:
// I don't understand how promises work, but this technically tells 
// me whether or not an input is truly an active Reddit username or not
checkUser("AutoModerator");
//function checkUser(testName) {
//    fetch("https://www.reddit.com/api/username_available.json?user=" + testName)
//        .then(response => response.text())
//        .then(text => console.log(text));
//}
// I understand this syntax a bit more, but still doesn't allow me to use
// this data as I'd expect
async function checkUser(testName) {
    let url = "https://www.reddit.com/api/username_available.json?user=" + testName;

    let response = await fetch(url);
    let data = await response.text();
    //console.log(data);
}

function validateInput() {
    warning.innerHTML = "";
    warning.style.color = "red";

    const regexp = /^\/?(?:(?:user|u)\/)?([\w-]{3,20})\/?$/;
    let input = blockRule.value;
    let userName = "";

    let isValid = regexp.test(input);

    if(isValid) {
        userName = "/user/" + regexp.exec(input)[1] + "/";
    } else {
        warning.innerHTML = "Please input a valid user";
        return;
    }

    for(let i = 0; i < userlist.length; i++) {
        if(userName.toUpperCase() === userlist[i].innerHTML.toUpperCase()) {
            warning.innerHTML = "Unable to add duplicate user";
            return;
        }
    }

    addBlock(userName);
}

function addBlock(userName) {
    let tablebody = table.querySelector("tbody");
    const index = table.rows.length - 1;

    const statuses = [];
    for(let i = 0; i < toggles.length; i++) {
        statuses.push(toggles[i].checked);
    }

    let template = `
                <tr id="user${index}">
                    <td>
                        <input type="checkbox" class="select">
                    </td>
                    <td class="user">${userName}</td>
                    <td>
                        <img src="img/expand.png" alt="Hidden" class="status" draggable="false">
                        <label class="toggle">
                            <input type="checkbox" class="toggle">
                            <span class="slider"></span>
                        </label>
                        <img src="img/blocked.png" alt="Blocked" class="status" draggable="false">
                    </td>
                </tr>
                    `;

    tablebody.innerHTML += template;

    blockRule.value = "";
    filter.value = "";
    filterList("");
    addInputs();

    for(let i = 0; i < toggles.length; i++) {
        toggles[i].checked = statuses[i];
    }

    toggles[toggles.length - 1].checked = groupStatus.checked;
}

// TODO: this is required mostly because adding a row as a template
//       string updates the whole table and breaks previously created
//       variables and event triggers
function addInputs() {
    groupSelect = document.getElementById("select-all");
    groupSelect.addEventListener("click", selectAll);
    checks = document.getElementsByClassName("select");

    for(let i = 0; i < checks.length; i++) {
        checks[i].addEventListener("click", updateSelect);
    }

    toggles = document.querySelectorAll("input.toggle");
}

function removeBlock() {
    let checkStates = [];

    for(const check of checks) {
        checkStates.push(check.checked);
    }

    let checker = arr => arr.every(v => v === false);

    if(checker(checkStates)) {
        warning.style.color = "red";
        warning.innerHTML = "Select users to remove";
        return;
    }

    for(let i = 0; i < checkStates.length; i++) {
        if(checkStates[i]) {
            document.getElementById("user" + i).remove();
        }
    }

    let blocklist = document.querySelectorAll("[id^='user']");

    for(let i = 0; i < blocklist.length; i++) {
        blocklist[i].id = "user" + i;
    }

    warning.innerHTML = "";
    groupSelect.checked = false;
}

// TODO: select-all on a filtered list will select hidden entries
function filterList() {
    let input = filter.value.trim().toUpperCase();

    let blocklist = document.querySelectorAll("[id^='user']");

    for(let i = 0; i < userlist.length; i++) {
        if(userlist[i].innerHTML.toUpperCase().indexOf(input) > -1) {
            blocklist[i].removeAttribute("style");
        } else {
            blocklist[i].style.display = "none";
        }
    }
}

function toggleSelected() {
    for(let i = 0; i < checks.length; i++) {
        if(checks[i].checked) {
            toggles[i].checked = groupStatus.checked;
        }
    }
}

function selectAll() {
    for(let i = 0; i < checks.length; i++) {
        let row = checks[i].parentElement.parentElement;
        let isHidden = row.style.display === "none";

        if(isHidden) {
            continue;
        }

        if(!this.checked) {
            checks[i].checked = false;
        } else if(this.checked) {
            checks[i].checked = true;
        } else {
            checks[i].checked = false;
        }
    }

    updateSelect();
}

// TODO: checking selected toggles doesn't sync up groupStatus
function updateSelect() {
    let hasTrue = false;
    let hasFalse = false;

    for(let check of checks) {
        if(check.checked) {
            hasTrue = true;
        } else {
            hasFalse = true;
        }
    }

    groupSelect.checked = hasTrue && !hasFalse;

    let countHidden = 0;
    let countBlocked = 0;

    for(let i = 0; i < checks.length; i++) {
        if(checks[i].checked) {
            if(toggles[i].checked) {
                countBlocked++;
            } else {
                countHidden++;
            }
        }
    }

    if(countBlocked !== countHidden) {
        groupStatus.checked = countBlocked > countHidden;
    }
}

function sortTable() {
    let checkCol = [];
    let userCol = [];
    let statusCol = [];

    for(let i = 1; i < table.rows.length; i++) {
        checkCol.push(table.rows[i].cells[0]);
        userCol.push(table.rows[i].cells[1]);
        statusCol.push(table.rows[i].cells[2]);
    }

    // is sort by selection useful?
    let onButton = groupSelect.matches(":hover");

    if(this === document.getElementById("head-check") && !onButton) {
        currSort = "check";
        console.log(currSort + "[0]: " + checkCol[0].querySelector("input").checked);
    } else if(this === document.getElementById("head-user")) {
        currSort = "user";
        console.log(currSort + "[0]: " + userCol[0].innerHTML);
    } else if(this === document.getElementById("head-status")) {
        currSort = "status";
        console.log(currSort + "[0]: " + statusCol[0].querySelector("input").checked);
    }
}

function updateSettings(result) {
    let users = document.querySelectorAll("[id^='user']");
    let key = "user" + users.length;

    addBlock(result[key].user);
}

function loadSettings() {
    chrome.storage.sync.get(["entries"], function (result) {
        for(let i = 0; i < result.entries; i++) {
            let key = "user" + i;

            chrome.storage.sync.get([key], function (result) {
                updateSettings(result);
                toggles[i].checked = result[key].status;
            });
        }
    });
}

function saveSettings() {
    chrome.storage.sync.clear();

    let users = [];
    let statuses = [];

    for(let i = 0; i < userlist.length; i++) {
        users.push(userlist[i].innerHTML);
        statuses.push(toggles[i].checked);
    }

    let blocklist = [];

    for(let i = 0; i < userlist.length; i++) {
        blocklist.push({
            "user": users[i],
            "status": statuses[i]
        });
    }

    let countEntries = 0;

    for(let i = 0; i < userlist.length; i++) {
        let key = "user" + i;

        let entry = { [key]: blocklist[i] };

        chrome.storage.sync.set(entry)
        countEntries++;
    }

    chrome.storage.sync.set({ entries: countEntries });

    warning.style.color = "green";
    warning.innerHTML = "Saved settings";
}

function hideElements() {
    let pageTitle = document.getElementsByTagName("h1")[0];
    let statusIcons = document.getElementsByClassName("status");

    if(window.innerWidth < 832) {
        pageTitle.className = "hidden";
    } else {
        pageTitle.classList.remove("hidden");
    }
}