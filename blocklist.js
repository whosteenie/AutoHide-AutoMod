
document.addEventListener("DOMContentLoaded", loadSettings);

document.getElementById("add").addEventListener("click", validateInput);
document.getElementById("blockRule").addEventListener("keydown", (e) => { if(e.code === "Enter") { validateInput(); } });
document.getElementById("remove").addEventListener("click", removeBlock);

document.getElementById("save").addEventListener("click", saveSettings);

document.getElementById("filter").addEventListener("keyup", filterList);

function validateInput() {
    let alert = document.getElementById("alert");
    alert.innerHTML = "";
    alert.style.color = "red";

    let value = document.getElementById("blockRule").value;

    // TODO: need to find a better way to validate and clean up user input
    // TODO: allow for /u/name/ format

    let userName = new String();

    // /user/name/
    if(/^\/user\/.*\//.test(value)) {
        userName = value;
    }
    // name
    else if(/^[a-zA-z0-9-_]+$/.test(value)) {
        userName = "/user/" + value + "/";
    }
    // user/name
    else if(/^user\/[a-zA-z0-9-_]*$/.test(value)) {
        userName = "/" + value + "/";
    }
    // /user/name
    else if(/^\/user\/[a-zA-z0-9-_]*$/.test(value)) {
        userName = value + "/";
    }
    // user/name/
    else if(/^user\/[a-zA-Z0-9-_]*\/$/.test(value)) {
        userName = "/" + value;
    } else {
        alert.innerHTML = "Please input a valid user";
        return;
    }

    let blockRules = document.getElementsByClassName("user");

    for(let i = 0; i < blockRules.length; i++) {
        if(userName === blockRules[i].innerHTML) {
            alert.innerHTML = "Unable to add duplicate user";
            return;
        }
    }

    addBlock(userName);
}

function addBlock(userName) {
    let blocklist = document.getElementById("blocklist").getElementsByTagName("tbody")[0];
    let index = document.getElementById("blocklist").rows.length - 1;

    let template = `
                <tr id="user${index}">
                <td>
                    <input type="checkbox" class="select" name="block">
                </td>
                <td class="user">${userName}</td>
                <td>
                    <img src="img\\expand.png" alt="Hidden" class="status" draggable="false">
                    <label class="toggle">
                            <input type="checkbox" class="toggle">
                            <span class="slider"></span>
                    </label>
                    <img src="img\\blocked.png" alt="Blocked" class="status" draggable="false">
                </td>
                </tr>

                    `;

    blocklist.innerHTML += template;
    document.getElementById("blockRule").value = "";
    document.getElementById("filter").value = "";
    filterList("");
}

function removeBlock() {
    let checks = document.getElementsByClassName("select");

    for(let i = 0; i < checks.length; i++) {
        if(checks[i].checked) {
            document.getElementById("user" + i)?.remove();
        }
    }

    // TODO: removing multiple entries doesn't work

    let blocklist = document.querySelectorAll("[id^='user']");

    for(let i = 0; i < blocklist.length; i++) {
        blocklist[i].id = "user" + i;
    }
}

function loadSettings() {
    window.alert("loaded");

    let blocklist = new Array();

    for(let i = 0; i < 3; i++) {
        blocklist.push(chrome.storage.sync.get("user" + i));
    }

    console.log(blocklist);
}

function saveSettings() {
    let blockusers = document.getElementsByClassName("user");
    let blockstatuses = document.querySelectorAll("input[class=toggle]");

    let users = new Array();
    let statuses = new Array();

    for(let i = 0; i < blockusers.length; i++) {
        users.push(blockusers[i].innerHTML);
        statuses.push(blockstatuses[i].checked);
    }

    let blocklist = new Array();

    for(let i = 0; i < blockusers.length; i++) {
        blocklist.push({
            "user": users[i],
            "status": statuses[i]
        });
    }

    for(let i = 0; i < blockusers.length; i++) {
        let key = "user" + i;
        chrome.storage.sync.set({[key]: blocklist[i]});
    }

    let alert = document.getElementById("alert");
    alert.style.color = "green";
    alert.innerHTML = "Saved settings";
}

function filterList() {
    let input = document.getElementById("filter").value.trim().toUpperCase();

    let blocklist = document.querySelectorAll("[id^='user']");
    let userlist = document.querySelectorAll("[class^='user']");

    for(let i = 0; i < userlist.length; i++) {
        if(userlist[i].innerHTML.toUpperCase().indexOf(input) > -1) {
            blocklist[i].style.display = "";
        } else {
            blocklist[i].style.display = "none";
        }
    }
}