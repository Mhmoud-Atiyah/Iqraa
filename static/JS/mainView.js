//---------------------------------------------------------
// Main Elements
//---------------------------------------------------------
const read_Bt = document.getElementById("read");
const statusBt = document.getElementById("status-icon");
const Dock = document.getElementById("nav");
const themeBt = document.getElementById("theme-icon");
const accountBt = document.getElementById("profile-name");
const profileBt = document.getElementById("profile-pic");
const current = document.getElementById("current");
const settingBt = document.getElementById("settings");
const openBookBt = document.getElementsByClassName("openBookBt");
const searchList = document.getElementById("search-list");
const searchInput = document.getElementById("search-input");
//---------------------------------------------------------
// Dynamically Allocated Elements
//---------------------------------------------------------
function secondryShowItem(title, elem) {
    let element =
        `
    <li class="secondry-nav-item">
        <a class="nav-link" href="#">${title}</a>
    </li>
    `;
    elem.append(element)
}
/**
 * @description Main Client Routine To Read Data saved local from server
 *  
 * @param {string} path word of data needed
 * @returns object of data
 */
function getData(path) {
    let obj = fetch(`http://localhost:1999/${path}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};
// Function to get ID Of User
function getQueryParams() {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const params = {};
    vars.forEach(v => {
        const pair = v.split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    });
    return params;
}
const ID = getQueryParams().userId;
// Main Routine On start
window.onload = () => {
    getData("Config").then((config) => { // Global Config not User Config
        /* Theme setting */
        if (config.dark) { // Now is Dark
            themeBt.className = "fa-solid fa-sun";
        } else {    // Now is Light
            themeBt.className = "fa-solid fa-moon";
        }
        /* Connection Setting */
        if (config.connection) { // Now is online
            statusBt.className = "fa-solid fa-signal";
        } else {    // Now is offline
            statusBt.className = "fa-solid fa-plane";
        }
        /* Dock Settings */
        if (config.dock === "show") {
            Dock.style.display = "block";
        } else if (config.dock === "auto-hide") {
            //TODO: Do it's staff
        }
        /* Theme Settings */
        //TODO: 
    })
    getData(`userData/${ID}`).then((userData) => { // Current User Data
        accountBt.innerText = userData.firstName + " " + userData.lasttName;
        profileBt.src = userData.profile;
        profileBt.alt = userData.account;
        current.src = userData.current.cover;
        current.title = userData.current.title;
        current.setAttribute("data-path", userData.current.id);
        for (let index = 0; index < userData.lastSearch.length; index++) {
            let elem = document.createElement("li");
            elem.className = "dropdown-item";
            elem.innerText = userData.lastSearch[index];
            searchList.append(elem);
        }
    })
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
}
/* 
    Search Staff 
*/
searchInput.onclick = () => {
    searchList.style.display = "block"
};
searchInput.oninput = () => {
    searchList.innerHTML = "";
}
/* 
    Global Event Listener
*/
/* Open Book */
for (let index = 0; index < openBookBt.length; index++) {
    openBookBt[index].onclick = () => {
        window.IPC.openBookWindow(openBookBt[index].getAttribute("data-path"));
    }
}
/* Setting button */
settings.onclick = () => {
    window.IPC.openSettingWindow();
}