
/* --- Style --- */
let body = document.getElementsByTagName("body")[0];
let topMenu = document.getElementById("top-menu");
let content = document.getElementById("content");
let title = document.getElementsByTagName("h1")[0];
let rows = document.getElementsByClassName("entries");
let headers = document.getElementById("headers");
/* ------------- */

const filter = document.getElementById("filter");
const groupStatus = document.getElementById("group-status");
const table = document.getElementById("blocklist");
const userlist = document.getElementsByClassName("user");
const blockRule = document.getElementById("block-rule");
const warning = document.getElementById("warning");

let checks = document.getElementsByClassName("select");
let toggles = document.querySelectorAll("input.toggle");
let groupSelect = document.getElementById("select-all");
let currSort = "time";

document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSettings();
    }
});

window.addEventListener("resize", hideElements);

filter.addEventListener("keyup", filterList);
groupStatus.addEventListener("click", toggleSelected);
groupStatus.addEventListener("keydown", (e) => { if(e.code === "Enter") { groupStatus.click(); } });

blockRule.addEventListener("keydown", (e) => { if(e.code === "Enter") { validateInput(); } });
document.getElementById("add").addEventListener("click", validateInput);
document.getElementById("remove").addEventListener("click", removeBlock);

document.getElementById("save").addEventListener("click", saveSettings);

document.getElementById("head-check").addEventListener("click", sortTable);
document.getElementById("head-user").addEventListener("click", sortTable);
document.getElementById("head-status").addEventListener("click", sortTable);

loadSettings();
addInputs();
hideElements();

async function validateInput() {
	warning.innerText = "";
	warning.style.color = "red";

    const regexp = /^(?:https:\/\/)?(?:www\.)?(?:reddit\.com)?\/?\/?(?:(?:user|u)\/)?([\w-]{3,20})\/?$/;
    let input = blockRule.value.trim();
    let userName = "";

    let url = "https://www.reddit.com/api/username_available.json?user=" + input;
    let response = await fetch(url);
    let exists = !(await response.text() === "true");

    let isValid = regexp.test(input);

    if(isValid && exists) {
        userName = "/user/" + regexp.exec(input)[1] + "/";
    } else {
        warning.innerText = "Please input a valid user";
        return;
    }

    for(let i = 0; i < userlist.length; i++) {
        if(userName.toUpperCase() === userlist[i].innerText.toUpperCase()) {
            warning.innerText = "Unable to add duplicate user";
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
                <tr class="entries" id="user${index}">
                    <td class="no-select">
                        <input type="checkbox" class="select">
                    </td>
                    <td class="user">${userName}</td>
                    <td class="no-select">
                        <img src="img/expand.svg" alt="Hidden" class="status" draggable="false">
                        <label class="toggle">
                            <input type="checkbox" class="toggle">
                            <span class="slider"></span>
                        </label>
                        <img src="img/blocked.svg" alt="Blocked" class="status" draggable="false">
                    </td>
                </tr>
                    `;

	// TODO: this line takes about 1ms to run
	tablebody.innerHTML += template;

    blockRule.value = "";
    filter.value = "";
    filterList();
	addInputs();
	hideElements();
	loadStyles();

    for(let i = 0; i < toggles.length; i++) {
        toggles[i].checked = statuses[i];
    }

    toggles[toggles.length - 1].checked = groupStatus.checked;
}

// TODO: this is required because adding a row as a template string
//       updates the whole table and breaks previously created
//       variables and event triggers
function addInputs() {
    groupSelect = document.getElementById("select-all");
	groupSelect.addEventListener("click", selectAll);
	groupSelect.addEventListener("keydown", (e) => { if(e.code === "Enter") { groupSelect.click(); } });
    checks = document.getElementsByClassName("select");

	for(const check of checks) {
		check.addEventListener("click", updateSelect);
		check.addEventListener("keydown", (e) => { if(e.code === "Enter") { check.click(); } });
	}

	toggles = document.querySelectorAll("input.toggle");
	for(const toggle of toggles) {
		toggle.addEventListener("keydown", (e) => { if(e.code === "Enter") { toggle.click(); } });
	}
}

function removeBlock() {
    let checkStates = [];

    for(const check of checks) {
        checkStates.push(check.checked);
    }

    let checker = arr => arr.every(c => c === false);

    if(checker(checkStates)) {
        warning.style.color = "red";
        warning.innerText = "Select users to remove";
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

    warning.innerText = "";
    groupSelect.checked = false;
}

// TODO: select-all on a filtered list will select hidden entries
function filterList() {
    let input = filter.value.trim().toUpperCase();

    let blocklist = document.querySelectorAll("[id^='user']");

    for(let i = 0; i < userlist.length; i++) {
        if(userlist[i].innerText.toUpperCase().indexOf(input) > -1) {
            blocklist[i].removeAttribute("style");
        } else {
            blocklist[i].style.display = "none";
        }
    }
}

function sortTable() {
	let n = null;

	if(this.id === "head-check") {
		n = 0;
	} else if(this.id === "head-user") {
		n = 1;
	} else {
		n = 2;
	}

	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("blocklist");
	switching = true;

	dir = "asc";

	while(switching) {
		switching = false;
		rows = table.rows;

		for(i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;

			x = rows[i].getElementsByTagName("td")[n];
			y = rows[i + 1].getElementsByTagName("td")[n];

			if(n === 0 || n === 2) {
				if(dir === "asc") {
					if(x.getElementsByTagName("input")[0].checked > y.getElementsByTagName("input")[0].checked) {
						shouldSwitch = true;
						break;
					}
				} else if(dir === "desc") {
					if(x.getElementsByTagName("input")[0].checked < y.getElementsByTagName("input")[0].checked) {
						shouldSwitch = true;
						break;
					}
				}
			} else {
				if(dir === "asc") {
					if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				} else if(dir === "desc") {
					if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			}
		}
		if(shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;

			switchcount++;
		} else {
			if(switchcount === 0 && dir === "asc") {
				dir = "desc";
				switching = true;
			}
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

    if(countBlocked !== countHidden && countHidden > 1 || countBlocked > 1) {
        groupStatus.checked = countBlocked > countHidden;
    }
}

function loadStyles() {
	chrome.storage.sync.get("theme", function (result) {
		body.classList.add(result.theme);
		topMenu.classList.add(result.theme);
		content.classList.add(result.theme);
		title.classList.add(result.theme);
		headers.classList.add(result.theme);

		for(const row of rows) {
			row.classList.add(result.theme);
		}
	});
}

function loadSettings() {
	chrome.storage.sync.get("userlist", function (result) {
		for(let i = 0; i < result.userlist.length; i++) {
			let key = "user" + i;
			addBlock(result.userlist[i][key].user)
			toggles[i].checked = result.userlist[i][key].status;
		}
	});

	chrome.storage.sync.get("rule", function (result) {
		groupStatus.checked = (result.rule === "true");
	});

	loadStyles();
}

function saveSettings() {
	chrome.storage.sync.remove("userlist");

    let blocklist = [];

	for(let i = 0; i < userlist.length; i++) {
		let data = {
			"user": userlist[i].innerText,
			"status": toggles[i].checked
		};

		let key = "user" + i;

		blocklist.push({ [key]: data });
	}

	let list = { ["userlist"]: blocklist };
	chrome.storage.sync.set(list);

    warning.style.color = "green";
    warning.innerText = "Saved settings";
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
			statusHead.innerText = "Status";
		} else {
			image.classList.remove("hidden");
			table.removeAttribute("style");
			statusHead.removeAttribute("style");
			statusHead.innerText = "Status: Hidden / Blocked";
		}
	}
}