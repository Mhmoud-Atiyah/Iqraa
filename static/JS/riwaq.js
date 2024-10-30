import misc from "./misc.js";
import riwaqScreen from "../components/riwaqScreen.js";
import riwaqWelcome from "../components/riwaqWelcome.js";
import showHideSecondaryWindow from "./SecondaryWindow.js";
import riwaqUser from "../components/riwaqUser.js";

const validSqlTEXT = /^[a-zA-Z0-9\s\u0600-\u06FF\u0750-\u077F]+$/;
const sessionId = misc.getQueryParams().sessionId || null
// Main Routine On start
window.onload = () => {
    /******************
     * Get Window Ready
     ******************/
    // TODO: Retrieve from indexdb
    misc.getData(`loadConfig/${misc.ID}`).then((config) => {
        /****************
         * Welcome Message
         * **************/
        if (config.newriwaq) {
            riwaq.Side.style.display = 'none';
            riwaq.messageSection.style.display = 'none';
            document.getElementById('markers').style.display = 'none';
            let Div = document.createElement('div');
            Div.id = "mainChild";
            // TODO: center Welcome message
            Div.innerHTML = riwaqWelcome();
            document.getElementById("conversation").append(Div);
            library.initBt.classList.add("pulsed-border");
        }
        /**********
         * Riwaq User
         * ***********/
        else {
            /********
             * Session Exist
             * *******/
            if (sessionId != null) {
                /***
                 * get Session Data
                 * */
                misc.postData("sessionData", {
                    userId: misc.ID,
                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                    sessionID: sessionId
                }).then(res => {
                    if (!res.status) {
                        console.log(res.msg);
                        const sessionData = res.data;
                        /***
                         * Admin Interface
                         * */
                        if (sessionData.adminid === misc.ID) {
                            profileBt.style.border = "solid 1px var(--App-redColor)";
                        }
                        /****
                         * Client Or Strange
                         * */
                        else {
                            /***
                             * Client Interface
                             * */
                            if (sessionData.partiesids.includes(misc.ID)) {
                                profileBt.style.border = "solid 1px var(--App-linkColor)";
                                /***
                                 * Load Users Window
                                 * */
                                if (sessionData.partiesids.length) {
                                    riwaqUser(sessionData);
                                }
                            }
                            /***
                             * Strange
                             * */
                            else {
                                //     TODO: Show Warning window
                                window.location.href = '/iqraa'
                            }
                        }
                    }
                    /***
                     * Not Authorized
                     * */
                    else {
                        console.log(res.msg);
                    }
                });
                /***
                 * Create Socket
                 * */
                const Socket = io();
                // On Create Socket
                Socket.on('data', (data) => {
                    const req = data.type;
                    if (req === 'init') {
                        const {id, message} = data;
                        console.log(message);
                        console.log(`Your Socket ID [${id}]`);
                        misc.postData(`editConfig/${misc.ID}/`, {
                            socket: id
                        }).then(() => {
                            console.log("update Socket Id Successfully!")
                        });
                    } else if (req === 'ask') {
                        const {id, socket, account, name, profile} = data;
                        console.log(`client [${id}] try to connect`);
                        //TODO: Handle this (user prompt => approve - decline)
                        let opt = true;
                        /***
                         * Accept User
                         * */
                        if (opt) {
                            Socket.emit('askPermission', {
                                permit: true,
                                sessionId: sessionId,
                                client: id,
                                socket: socket
                            })
                            console.log(`client [${id}] connected`);
                        }
                        /****
                         * Decline User
                         * */
                        else {
                            Socket.emit('askPermission', {
                                permit: false,
                                socket: socket
                            });
                            console.log(`client [${id}] Declined`);
                        }
                    }
                });
                // Handle incoming messages from the server
                Socket.on('message', (message) => {
                    console.log(message.message)
                });
                /******
                 * Exit Session Button
                 * ******/
                riwaq.initIcon.classList.replace('fa-users', 'fa-right-from-bracket');
                riwaq.initIcon.setAttribute("function-close", 'true');
                document.getElementById("initIcon").style.color = "var(--App-redColor)";
                /***
                 * My Screen
                 * */
                if (config.camera) {
                    misc.enableCamera().then(() => {
                            riwaqScreen('myScreen');
                        }
                    )
                }
                /*            TODO:
          if (conversationUsers >= 32 or some big value) {
          conversationUsers.window.height = "number" px;
          }else{
              // conversationUsers.windows.height = "auto";
          }*/
            }
        }
        /*****
         * Load Effect
         * ****/
        document.getElementsByClassName('loader')[0].remove();
        mainView.style.filter = "blur(0)";
    })
}
/********
 * Electron UI
 * ******/
if (misc.isElectron()) {
    window.onresize = () => {
        document.getElementById("main").style.height = window.innerHeight - 50 + 'px';
        document.getElementById("mainSide").style.height = window.innerHeight - 50 + 'px';
        document.getElementById("mainSide").style.width = window.innerWidth - 220 + 'px';
        riwaq.Side.style.height = window.innerHeight - 50 + 'px';
        document.getElementById("SessionNotes").style.height = window.innerHeight - 350 + 'px';
        document.getElementById("conversation").style.height = window.innerHeight - 110 + 'px';
        document.getElementById("conversation").style.width = window.innerWidth - 220 + 'px';
        document.getElementById("messageInputText_in").style.width = window.innerWidth - 412 + 'px';
    }
}
/**************
 * Markers and Highlighter Button
 * **************/
riwaq.markersBt.onclick = () => {
    // TODO: on click pen enter the Marker Mode which hide Coversation and replace it with WhiteBoard or file added
    if (riwaq.markersBt.getAttribute("data-show") === "show") {
        riwaq.markersBt.setAttribute("data-show", "hide");
        riwaq.markersModal.style.display = "none";
        riwaq.markersIcon.className = "fa-solid fa-pen-nib";
    } else {
        riwaq.markersBt.setAttribute("data-show", "show");
        riwaq.markersModal.style.display = "block";
        riwaq.markersIcon.className = "fa-solid fa-xmark";
    }
};
/**************
 * Add file Button
 * **************/
riwaq.addFileBt.onclick = () => {
    //TODO: Add File To Conversation like What'sApp
    //      Then When File like image loaded we put like on whiteboard using pens on top bar
    //  ومنعم خيار يكوت صفحة بيضا زي السبورة
    riwaq.addFileIn.click();
}
riwaq.addFileIn.oninput = () => {
    if (riwaq.addFileIn.value !== "") {
        const File = riwaq.addFileIn.files[0].path;
        /******
         * Handler Based on File Type
         * */
        if (riwaq.addFileIn.files[0].type.includes('image')) {
            console.log("it's image");
        } else if (riwaq.addFileIn.files[0].type.includes('text')) {
            console.log("it's text");
        } else if (riwaq.addFileIn.files[0].type.includes('application/pdf')) {
            console.log("it's pdf");
        } else if (riwaq.addFileIn.files[0].type.includes('video')) {
            console.log("it's video");
        } else if (riwaq.addFileIn.files[0].type.includes('audio')) {
            console.log("it's audio");
        }
        //TODO: Add File To Conversation like What'sApp
    }
}
/**************
 * Emoji Button
 * **************/
riwaq.emojiBt.onclick = () => {
    if (riwaq.emojiPicker.getAttribute("data-display") === 'block') {
        riwaq.emojiPicker.setAttribute("data-display", 'none');
        riwaq.emojiPicker.style.display = 'none';
    } else {
        riwaq.emojiPicker.setAttribute("data-display", 'block');
        riwaq.emojiPicker.style.display = 'block';
    }
}
riwaq.emojiPicker.addEventListener('emoji-click', event => {
    riwaq.messageInput.value += event.detail.unicode;
    riwaq.emojiPicker.setAttribute("data-display", 'none');
    // riwaq.emojiPicker.style.display = 'none';// Hide the Window
});
/*******
 * Focus Out
 * ****/
document.addEventListener('click', event => {
    if (!riwaq.emojiPicker.contains(event.target) && !riwaq.emojiBt.contains(event.target)) {
        riwaq.emojiPicker.setAttribute("data-display", 'none');
        riwaq.emojiPicker.style.display = 'none';
    }
});
/******
 * Init/Close Session Button
 * *******/
riwaq.initBt.onclick = () => {
    if (riwaq.initBt.getAttribute("data-show") === "show") {
        riwaq.initBt.setAttribute("data-show", "hide");
        riwaq.initModal.style.display = "none";
        riwaq.initIcon.className = "fa-solid fa-users";
        riwaq.sessionIdField.style.display = "block";
        riwaq.BookNameField.style.display = "block";
        riwaq.BookNameField.classList.remove("mb-2");
        riwaq.joinSessionBt.classList.remove("disabled");
        riwaq.initSessionBt.classList.remove("disabled");
    } else {
        /***
         * Regular init Session
         * */
        if (!riwaq.initIcon.getAttribute("function-close")) {
            riwaq.initBt.setAttribute("data-show", "show");
            riwaq.initModal.style.display = "block";
            library.initBt.classList.remove("pulsed-border");
            setTimeout(() => {
                riwaq.initIcon.className = "fa-solid fa-xmark";
            }, 1800);
        }
        /***
         * Exit Session
         * */
        else {
            //TODO: Close Session Routine
        }
    }
}
/*******
 * Misc Theme
 * *******/
riwaq.BookNameInput.onclick = () => {
    riwaq.BookNameField.classList.add("mb-2");
    riwaq.sessionIdField.style.display = "none";
    riwaq.joinSessionBt.classList.add("disabled");
}
riwaq.sessionIdInput.onclick = () => {
    riwaq.BookNameField.style.display = "none";
    riwaq.initSessionBt.classList.add("disabled");
}
/*******
 * Create New Session Routine
 * *******/
riwaq.initSessionBt.onclick = () => {
    if (riwaq.BookNameInput.value !== "" && riwaq.BookNameInput.value.length >= 3 && validSqlTEXT.test(riwaq.BookNameInput.value)) {
        const session_title = riwaq.BookNameInput.value;
        riwaq.initBt.click();
        riwaq.initBt.classList.add("disabled");
        //TODO: add load effect
        misc.postData("initSession", {
            userId: misc.ID,
            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
            sessionTitle: session_title
        }).then((res) => {
            if (!res.status) {
                console.log(res.msg);
                // update User setting
                misc.postData(`editConfig/${misc.ID}/`, {
                    newriwaq: false
                }).then(() => {
                    console.log(`update User [userId: ${misc.ID}] Entry [newriwaq] Successfully!`)
                    // redirect to session
                    window.location.href = `/riwaq?userId=${misc.ID}&sessionId=${res.Id}`
                });
            }
            /***************
             * User Not Authorized
             * **************/
            else {
                //TODO: showHideSecondaryWindow() with error message
                console.error(res.msg);
            }
        });
    }
    /*******
     * Error !
     * *****/
    else {
        riwaq.BookNameInput.style.border = "solid #b3261eff 1px";
        showHideSecondaryWindow("خطأ", "املأ هذا الحقل <u>(اسم المكتبة)</u> أولاٌ", "تم");
        setTimeout(() => {
            showHideSecondaryWindow();
            riwaq.BookNameInput.style.border = "";
        }, 3000);
    }
}
/*******
 * Join to Session Routine
 * *******/
riwaq.joinSessionBt.onclick = () => {
    // Check Inputs First
    if (riwaq.sessionIdInput.value !== "" && riwaq.sessionIdInput.value.split("-").length === 5) {
        /***
         * Protect input from miss
         * */
        riwaq.sessionIdInput.disabled = 'true';
        /***
         * Client Socket
         * */
        const socket = io();
        let socketId;
        /***
         * Handle Admin Decision
         * */
        socket.on('resPermission', (data) => {
            const permit = data.permit;
            /***
             * Approved
             * */
            if (permit) {
                // update User setting
                misc.postData(`editConfig/${misc.ID}/`, {
                    newriwaq: false
                }).then(() => {
                    console.log(`update User [userId: ${misc.ID}] Entry [newriwaq] Successfully!`)
                    // redirect to session
                    window.location.href = `/riwaq?userId=${misc.ID}&sessionId=${riwaq.sessionIdInput.value}`;
                });
            }
            /****
             * Declined
             * */
            else {
                // TODO: Show Decline Alert
                console.log("Admin Declined");
            }
        });
        socket.on('data', (data) => {
            const req = data.type;
            if (req === 'init') {
                const {id, message} = data;
                console.log(message);
                console.log(`Your Socket ID [${id}]`);
                /***
                 * Post To Server
                 * */
                misc.postData("joinSession", {
                    userId: misc.ID,
                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                    sessionId: riwaq.sessionIdInput.value,
                    socketId: id
                }).then((res) => {
                    if (!res.status) {
                        console.log(res.msg);
                        misc.postData(`editConfig/${misc.ID}/`, {
                            socket: id
                        }).then(() => {
                            console.log("update Socket Id Successfully!")
                        });
                        /****
                         * Wait Effect
                         * */
                        setInterval(() => {
                            //TODO: show counter Modal for 60s
                            console.log(`wait for Admin Approval`);
                        }, 1000)
                    }
                    /***
                     * Recorded Session
                     * */
                    else {
                        //TODO: FUTURE!
                    }
                });
            }
        })
    }
}
