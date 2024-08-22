import misc from "./misc.js"

/**************
 * TODO: Remove this request and set the configuration on localstorage
 * ****************/
misc.getData(`loadConfig/${misc.ID}`).then((config) => { // Global Config not User Config
    /* Dark mode setting */
    if (config.thememode === "dark") { // Now is Dark
        themeBt.className = "fa-solid fa-sun";
        statusBt.setAttribute("data-mode", "dark");
        misc.loadTheme("darkTheme");
    } else {    // Now is Light
        themeBt.className = "fa-solid fa-moon";
        statusBt.setAttribute("data-mode", "light");
        misc.loadTheme("lightTheme");
    }
    /* Connection Setting */
    if (config.connected) { // Now is online
        statusBt.className = "fa-solid fa-signal";
        statusBt.setAttribute("data-mode", "on");
    } else {    // Now is offline
        statusBt.className = "fa-solid fa-plane";
        statusBt.setAttribute("data-mode", "off");
    }
    accountBt.innerText = config.fname + " " + config.lname;
    profileBt.src = config.profile;
    profileBt.alt = config.account;
    searchListWindow.style.width = searchInput.offsetWidth - 1 + 'px';
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
    /* for Media Css */
    if (window.innerWidth <= 480) { // Mobile Phone
        /* Search List */
        searchListWindow.style.width = searchInput.offsetWidth - 10 + 'px';
        searchListWindow.style.left = searchInput.offsetLeft + 5 + 'px';
    }
})
//---------------------------------------------------------
// Header's Event Listeners
//---------------------------------------------------------
// Connection Button
//TODO: اقفل او افتح اللي مفروض يتعمل بعد قفل او فتح الاتصال
statusBt.onclick = () => {
    if (statusBt.getAttribute("data-mode") === "on") {
        misc.postData(`editConfig/${misc.ID}/`, {
            connected: false
        }).then(res => {
            if (res) {
                setTimeout(() => {
                    statusBt.setAttribute("data-mode", "off");
                    statusBt.className = "fa-solid fa-plane";
                }, 500);
            }
        })
    } else {
        misc.postData(`editConfig/${misc.ID}/`, {
            connected: true
        }).then(res => {
            if (res) {
                setTimeout(() => {
                    statusBt.setAttribute("data-mode", "on");
                    statusBt.className = "fa-solid fa-signal";
                }, 500);
            }
        })
    }
}
// Theme Button
themeBt.onclick = () => {
    if (themeBt.getAttribute("data-mode") === "light") {
        misc.postData(`editConfig/${misc.ID}/`, {
            thememode: "dark"
        }).then((res) => {
            if (res) {
                document.querySelector("style").remove();
                themeBt.setAttribute("data-mode", "dark");
                themeBt.className = "fa-solid fa-sun";
                misc.loadTheme("darkTheme");
            }
        });
    } else {
        misc.postData(`editConfig/${misc.ID}/`, {
            thememode: "light"
        }).then((res) => {
            if (res) {
                document.querySelector("style").remove();
                themeBt.setAttribute("data-mode", "light");
                themeBt.className = "fa-solid fa-moon";
                misc.loadTheme("lightTheme");
            }
        });
    }
}