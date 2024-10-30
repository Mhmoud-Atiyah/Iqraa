import misc from "./misc.js"
import riwaqScreen from "../components/riwaqScreen.js";

const Href = new URL(window.location.href);
const pathname = Href.pathname;
/******
 * Add Load Effect
 * *******/
mainView.style.filter = "blur(12px)";
let preLoad = document.createElement("span");
preLoad.className = "loader";
preLoad.style.right = (window.innerWidth - 48) / 2 + 'px';
preLoad.style.top = (window.innerHeight - 48) / 2 + 'px';
document.body.append(preLoad)
// TODO: Remove this request and set the configuration on indexdb
/************
 * Iqraa User
 * *********/
if (misc.ID != null) {
    misc.getData(`loadConfig/${misc.ID}`).then((config) => {
            /******
             * Dark mode setting
             * ****/
            if (config.thememode === "dark") { // Now is Dark
                themeBt.className = "fa-solid fa-sun";
                statusBt.setAttribute("data-mode", "dark");
                misc.loadTheme("darkTheme");
            } else {    // Now is Light
                themeBt.className = "fa-solid fa-moon";
                statusBt.setAttribute("data-mode", "light");
                misc.loadTheme("lightTheme");
            }
            /******
             * Connection Setting
             * *******/
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
            /*******
             * Riwaq Buttons
             * *******/
            if (pathname === '/riwaq') {
                /***************
                 * Microphone Setting
                 * ***************/
                if (config.microphone) { // microphone is On
                    /* Session Mode */
                    if (sessionId != null) {
                        misc.enableMicrophone().then(() => {
                                console.log("microphone enabled on load");
                            }
                        ).catch(err => {
                            console.error("Error: ", err);
                            riwaq.micIcon.className = "fa-solid fa-microphone-slash";
                            riwaq.micIcon.setAttribute("data-mode", "off");
                        })
                    }
                    riwaq.micIcon.className = "fa-solid fa-microphone";
                    riwaq.micIcon.setAttribute("data-mode", "on");
                } else {    // microphone is Off
                    riwaq.micIcon.className = "fa-solid fa-microphone-slash";
                    riwaq.micIcon.setAttribute("data-mode", "off");
                }
                /***************
                 * CameraIcon Setting
                 * ***************/
                if (config.camera) { // camera is On
                    if (sessionId != null) {
                        misc.enableCamera().then(() => {
                                document.getElementsByClassName("sideScreenProfile")[0].style.display = "none";
                                console.log("Camera enabled on load");
                            }
                        ).catch(err => {
                            console.error("Error: ", err);
                            riwaq.cameraIcon.className = "fa-solid fa-video-slash";
                            riwaq.cameraIcon.setAttribute("data-mode", "off");
                        })
                    }
                    riwaq.cameraIcon.className = "fa-solid fa-video";
                    riwaq.cameraIcon.setAttribute("data-mode", "on");
                } else {    // camera is Off
                    document.getElementsByClassName("sideScreenProfile")[0].style.display = "block";
                    riwaq.cameraIcon.className = "fa-solid fa-video-slash";
                    riwaq.cameraIcon.setAttribute("data-mode", "off");
                }
            }
            // TODO: Add Search to header in riwaq
            if (!window.location.href.includes('riwaq')) {
                searchListWindow.style.width = searchInput.offsetWidth - 1 + 'px';
            }
            /**********
             * Book View
             * ********/
            if (misc.getQueryParams().bookId === null) {
                document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
            }
            /*******
             * Responsive UI
             * *******/
            if (window.innerWidth <= 480) { // Mobile Phone
                /* Search List */
                searchListWindow.style.width = searchInput.offsetWidth - 10 + 'px';
                searchListWindow.style.left = searchInput.offsetLeft + 5 + 'px';
            }
        }
    )
}
/**************
 * Internet User
 * ************/
else {
    /***
     * Redirect User
     * ***/
    if (pathname === '/riwaq' || pathname === '/library') {
        window.location.href = `iqraa`
    }
    /****
     * NOTE: on Internet User View the Warning Window 'd be Already Loaded.
     * */
    misc.loadTheme("lightTheme");
    /***
     * Theme
     * */
    themeBt.className = "fa-solid fa-moon";
    themeBt.setAttribute('data-bs-toggle', 'modal');
    themeBt.setAttribute('data-bs-target', '#confirmationModal');
    /****
     * Add book Button
     * */
    addBookBt.setAttribute('data-bs-toggle', 'modal');
    addBookBt.setAttribute('data-bs-target', '#confirmationModal');
    /***
     * Conection
     * */
    statusBt.className = "fa-solid fa-signal";
    statusBt.setAttribute('data-bs-toggle', 'modal');
    statusBt.setAttribute('data-bs-target', '#confirmationModal');
    statusBt.setAttribute("data-mode", "light");
    statusBt.setAttribute("data-mode", "on");
    accountBt.innerText = 'حساب زائر';
    profileBt.src = "assets/profile.png";
    console.log("أنت الآن في وضعية زائر");
}
/********
 * Connection Button
 * ********/
statusBt.onclick = () => {
    /***
     * Iqraa User
     * */
    if (misc.ID != null) {
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
}//TODO: اقفل او افتح اللي مفروض يتعمل بعد قفل او فتح الاتصال
/********
 * Theme Button
 ********/
themeBt.onclick = () => {
    if (misc.ID != null) {
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
}
/****
 * log-Out Bt
 * */
logOutBt.onclick = () => {
    /****
     * Remove all DB of User
     * */
    localStorage.removeItem('userId')
    localStorage.removeItem('userPass')
    /***
     * Redirect To login Page
     * */
    window.location.href = '/login';
}
/*******
 * Riwaq Buttons
 * *******/
if (pathname === '/riwaq') {
    /*******
     * Adjust UI
     * ******/
    riwaq.initModal.style.display = "none";
    riwaq.UsersWindow.style.display = "none";
    riwaq.Side.style.height = window.innerHeight - 50 + 'px';
    document.getElementById("SessionNotes").style.height = window.innerHeight - 350 + 'px';
    document.getElementById("conversation").style.height = window.innerHeight - 110 + 'px';
    document.getElementById("conversation").style.width = window.innerWidth - 220 + 'px';
    if (window.innerWidth <= 480) {
        //document.getElementById("Side").style.height = window.innerHeight - 120 + 'px';
        document.getElementById("messageInput").style.width = window.innerWidth + 'px';
        document.getElementById("messageInputText_in").style.width = window.innerWidth - 180 + 'px';
    } else {
        document.getElementById("messageInput").style.width = window.innerWidth - 220 + 'px';
        document.getElementById("messageInputText_in").style.width = window.innerWidth - 420 + 'px';
    }
    riwaq.initBt.setAttribute("data-show", "hide");
    riwaq.UsersWindow.setAttribute("data-display", 'none');
    riwaq.Side.setAttribute("data-display", 'block');
    riwaq.emojiPicker.setAttribute("data-display", 'none');
    riwaq.markersBt.setAttribute("data-show", "hide");
    /******
     * Academy Mode Session
     * ******/
    riwaq.AcademyModeBt.onclick = () => {
        /*TODO: Design and Implement The mode */
    }
    /*******
     * Microphone Button
     * *******/
    riwaq.micIcon.onclick = () => {
        if (riwaq.micIcon.getAttribute("data-mode") === "on") {
            postData(`editConfig/${misc.ID}/`, {
                microphone: false
            }).then((res) => {
                if (res) {
                    if (disableMicrophone()) {
                        riwaq.micIcon.setAttribute("data-mode", "off");
                        riwaq.micIcon.className = "fa-solid fa-microphone-slash";
                        console.log("microphone disabled on click");
                    } else {
                        console.error('Failed to disable microphone.');
                    }
                }
            });
        } else {
            postData(`editConfig/${misc.ID}/`, {
                microphone: true
            }).then((res) => {
                if (res) {
                    enableMicrophone().then(() => {
                            console.log("microphone enabled on click");
                            riwaq.micIcon.setAttribute("data-mode", "on");
                            riwaq.micIcon.className = "fa-solid fa-microphone";
                        }
                    ).catch(err => {
                        console.error("Error: ", err);
                        riwaq.micIcon.className = "fa-solid fa-microphone-slash";
                        riwaq.micIcon.setAttribute("data-mode", "off");
                    })
                }
            });
        }
    }//TODO: Turn Mic or Speaker for Iqraa Application
    /*******
     * Camera Button
     * *******/
    riwaq.cameraIcon.onclick = () => {
        if (riwaq.cameraIcon.getAttribute("data-mode") === "on") {
            misc.postData(`editConfig/${misc.ID}/`, {
                camera: false
            }).then((res) => {
                if (res) {
                    if (misc.disableCamera()) {
                        riwaq.micIcon.setAttribute("data-mode", "off");
                        riwaq.cameraIcon.setAttribute("data-mode", "off");
                        riwaq.cameraIcon.className = "fa-solid fa-video-slash";
                        document.getElementsByClassName("sideScreenProfile")[0].style.display = "block";
                        console.log("Camera disabled on click");
                    } else {
                        console.error('Failed to disable Camera.');
                    }
                }
            });
        } else {
            misc.postData(`editConfig/${misc.ID}/`, {
                camera: true
            }).then((res) => {
                if (res) {
                    if (res) {
                        misc.enableCamera().then(() => {
                                riwaqScreen('myScreen');
                                console.log("Camera enabled on click");
                                riwaq.cameraIcon.setAttribute("data-mode", "on");
                                riwaq.cameraIcon.className = "fa-solid fa-video";
                                document.getElementsByClassName("sideScreenProfile")[0].style.display = "none";
                            }
                        ).catch(err => {
                            console.error("Error: ", err);
                            riwaq.cameraIcon.className = "fa-solid fa-video-slash";
                            riwaq.cameraIcon.setAttribute("data-mode", "off");
                        })
                    }

                }
            });
        }
    }
    /*******
     * Users Button
     * *******/
    riwaq.UsersBt.onclick = () => {
        if (riwaq.UsersWindow.getAttribute("data-display") === 'block') {
            riwaq.UsersWindow.setAttribute("data-display", 'none');
            riwaq.UsersWindow.style.display = 'none';
        } else {
            riwaq.UsersWindow.setAttribute("data-display", 'block');
            riwaq.UsersWindow.style.display = 'block flex';
        }
    }
    /*******
     * About Session
     * *******/
    riwaq.SessionInfoBt.onclick = () => {
        /*TODO:*/
    };
    /*******
     * SessionSideBt
     * *******/
    riwaq.SessionSideBt.onclick = () => {
        /* Different Position Based on View */
        if (window.innerWidth <= 480) { // Mobile View
            if (riwaq.Side.getAttribute("data-display") === 'block') {
                riwaq.Side.setAttribute("data-display", 'none');
                riwaq.Side.style.display = 'none';
            } else {
                riwaq.Side.setAttribute("data-display", 'block');
                riwaq.Side.style.display = 'block flex';
            }
        } else { // Desktop View
            if (riwaq.Side.getAttribute("data-display") === 'block') {
                riwaq.Side.setAttribute("data-display", 'none');
                riwaq.Side.style.display = 'none';
                document.getElementById("messageInput").style.width = window.innerWidth + 'px';
                document.getElementById("messageInputText_in").style.width = window.innerWidth - 210 + 'px';
                riwaq.initBt.style.bottom = '70px';
                document.getElementById("initSession").style.bottom = '120px'
            } else {
                riwaq.Side.setAttribute("data-display", 'block');
                riwaq.Side.style.display = 'block flex';
                document.getElementById("messageInput").style.width = window.innerWidth - 220 + 'px';
                document.getElementById("messageInputText_in").style.width = window.innerWidth - 420 + 'px';
                riwaq.initBt.style.left = '20px';
                riwaq.initBt.style.bottom = '10px';
                document.getElementById("initSession").style.bottom = '60px'
            }
        }
    }
}
