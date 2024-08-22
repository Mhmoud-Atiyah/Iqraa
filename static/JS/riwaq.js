const ID = getQueryParams().userId; // get ID of User Open The Window
const sessionId = getQueryParams().sessionId || null

// Dynamically Create User on Room
function UsersElement(data, state, elem) {
    let div = document.createElement('div');
    let state_;
    if (state === 'listener') {
        state_ = `<span class="conversationUserStatus">
                    <i class="fa-solid fa-microphone-lines-slash me-1 text-danger"></i>
                    مستمع
                    </span>`;
    } else if (state === 'speaker') {
        state_ = `<span class="conversationUserStatus">
                        <i class="fa-solid fa-microphone-lines me-2 text-warning"></i>
                        يتكلم
                        </span>`;
    } else {
        state_ = `<span class="conversationUserStatus">المضيف</span>`;
    }
    div.className = "col-md-3";
    div.innerHTML = `
    <div class="conversationUser">
        <img src="${data[0]}"
            class="conversationUserImg">
        <div class="conversationUserTitle">
            <span class="conversationUserName fw-bold">${data[1]}</span>
            ${state_}
            </div>
    </div>
    `;
    elem.append(div);
}

// Main Routine On start
window.onload = () => {
    /* Load User Configurations */
    getData(`loadConfig/${ID}`).then((config) => { // Global Config not User Config
        /* Microphone Setting */
        if (config.microphone) { // microphone is On
            /* Session Mode */
            if (sessionId != null) {
                enableMicrophone().then(() => {
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
        /* speakerIcon Setting */
        if (config.speaker) { // speaker is On
            riwaq.speakerIcon.className = "fa-solid fa-volume-high";
            riwaq.speakerIcon.setAttribute("data-mode", "on");
        } else {    // speaker is Off
            riwaq.speakerIcon.className = "fa-solid fa-volume-xmark";
            riwaq.speakerIcon.setAttribute("data-mode", "off");
        }
        /* CameraIcon Setting */
        if (config.camera) { // camera is On
            if (sessionId != null) {
                enableCamera().then(() => {
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
        // Current User Data
        if (config.newriwaq) { // First look riwaq
            let arr = "<span>&#8595;</span>", element =
                `
                <div class="newSection overflow-hidden m-md-2 text-center rounded" style="border: solid 1px var(--App-panelBorderColor);">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;font-family: Moharram, serif">
                        <h1 class="text-warning" style="font-family: DecorationFont2;">النقاش يُثري الفكرَ ويرتقي <br> والفهمُ ينمو بفضلِ التجاربِ</h1>
                        <h1 class="display-4 fw-normal">ما زال الرواق <span class="text-danger">فارغ</span></h1>
                        <p class="lead fw-normal fs-3">يمكنك إستخدام الرواق حسب رغبتك<br></p>
                        <p class="lead fw-normal fs-3">فقط اضغط على الزر بالأسفل لبدأ رواق جديد<br>
                     كما يمكنك  الإنضام إلى رواق موجود</p>
                    </div>
                </div>
            `;
            let Div = document.createElement('div');
            let Arr = document.createElement('span');
            Div.id = "mainChild";
            Div.innerHTML = element;
            Arr.innerHTML = arr;
            document.getElementById("conversation").append(Div);
            library.initBt.append(Arr);
        }
    })
    /* If Session Exist (New - Join) */
    if (sessionId != null) {
        /* 1. Add Exit Button in header */
        document.getElementById("SessionExitBt").style.display = "block";
        /* 2. Join Session Button */
        riwaq.initBt.classList.add("disabled");
        document.getElementById("initIcon").style.color = "var(--App-linkHoverColor)";

    }
    document.getElementById("mainSide").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("mainSide").style.width = window.innerWidth - 220 + 'px';
    riwaq.Side.style.height = window.innerHeight - 50 + 'px';
    document.getElementById("SessionNotes").style.height = window.innerHeight - 350 + 'px';
    document.getElementById("conversation").style.height = window.innerHeight - 110 + 'px';
    document.getElementById("conversation").style.width = window.innerWidth - 220 + 'px';
    if (window.innerWidth <= 480) {
        //document.getElementById("Side").style.height = window.innerHeight - 120 + 'px';
        document.getElementById("messageInput").style.width = window.innerWidth + 'px';
        document.getElementById("messageInputText_in").style.width = window.innerWidth - 180 + 'px';
    } else {
        document.getElementById("messageInputText_in").style.width = window.innerWidth - 420 + 'px';
    }
    //TODO: 
    // if (conversationUsers >= 32 or some big value) {
    // conversationUsers.window.height = "number" px;
    // }else{
    //     // conversationUsers.windows.height = "auto";
    //}
    riwaq.initModal.style.display = "none";
    riwaq.initBt.setAttribute("data-show", "hide");
    riwaq.UsersWindow.setAttribute("data-display", 'none');
    riwaq.Side.setAttribute("data-display", 'block');
    riwaq.emojiPicker.setAttribute("data-display", 'none');
    riwaq.markersBt.setAttribute("data-show", "hide");
    riwaq.UsersWindow.style.display = "none";
}
// Routine Applied On Resize
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
/*
* Academy Mode Session
*/
riwaq.AcademyModeBt.onclick = () => {
    /*TODO: Design and Implement The mode */
}
//TODO: Turn Mic or Speaker for Iqraa Application
// Microphone Button
riwaq.micIcon.onclick = () => {
    if (riwaq.micIcon.getAttribute("data-mode") === "on") {
        postData(`editConfig/${ID}/`, {
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
        postData(`editConfig/${ID}/`, {
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
}
// Speaker Button
riwaq.speakerIcon.onclick = () => {
    if (riwaq.speakerIcon.getAttribute("data-mode") === "on") {
        postData(`editConfig/${ID}/`, {
            speaker: false
        }).then((res) => {
            if (res) {
                riwaq.speakerIcon.setAttribute("data-mode", "off");
                riwaq.speakerIcon.className = "fa-solid fa-volume-xmark";
            }
        });
    } else {
        postData(`editConfig/${ID}/`, {
            speaker: true
        }).then((res) => {
            if (res) {
                riwaq.speakerIcon.setAttribute("data-mode", "on");
                riwaq.speakerIcon.className = "fa-solid fa-volume-high";
            }
        });
    }
}
// Camera Button
riwaq.cameraIcon.onclick = () => {
    if (riwaq.cameraIcon.getAttribute("data-mode") === "on") {
        postData(`editConfig/${ID}/`, {
            camera: false
        }).then((res) => {
            if (res) {
                if (disableCamera()) {
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
        postData(`editConfig/${ID}/`, {
            camera: true
        }).then((res) => {
            if (res) {
                if (res) {
                    enableCamera().then(() => {
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
// Users Button
riwaq.UsersBt.onclick = () => {
    if (riwaq.UsersWindow.getAttribute("data-display") === 'block') {
        riwaq.UsersWindow.setAttribute("data-display", 'none');
        riwaq.UsersWindow.style.display = 'none';
    } else {
        riwaq.UsersWindow.setAttribute("data-display", 'block');
        riwaq.UsersWindow.style.display = 'block flex';
        //TODO: UsersElement(['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg', "محمد دغش"], 'listener', riwaq.UsersWindow);
    }
}
// About Session
riwaq.SessionInfoBt.onclick = () => {
    /*TODO:*/
};
// SessionSideBt
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
// Init Session Button
// TODO: on session going this button will red X button for Exit!
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
        riwaq.initBt.setAttribute("data-show", "show");
        riwaq.initModal.style.display = "block";
        setTimeout(() => {
            riwaq.initIcon.className = "fa-solid fa-xmark";
        }, 1800);
    }
}
/* Misc Theme */
riwaq.BookNameInput.onclick = () => {
    riwaq.BookNameField.classList.add("mb-2");
    riwaq.sessionIdField.style.display = "none";
    riwaq.joinSessionBt.classList.add("disabled");
}
riwaq.sessionIdInput.onclick = () => {
    riwaq.BookNameField.style.display = "none";
    riwaq.initSessionBt.classList.add("disabled");
}
/* Create New Session Routine */
riwaq.initSessionBt.onclick = () => {
    //TODO: Check Input First (Put some constraints)
    let session_title = '';
    if (riwaq.BookNameInput.value !== "" && riwaq.BookNameInput.value.length >= 3) {
        /* TODO: Search book and if exist then show book data in header
           else this will be session title */
        if (true) {
            session_title = riwaq.BookNameInput.value;
        }
        postData("initSession", {
            userId: ID,
            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
            //TODO: sessionTitle: Number(BookID), (if exist)
            sessionTitle: session_title
        }).then((sessionId) => {
            /* Just Reload Riwaq With SessionId */
            window.location.href = `riwaq?userId=${ID}&sessionId=${sessionId}`;
        });
    }
}
/* Join to Already Exist Session Routine */
riwaq.joinSessionBt.onclick = () => {
    // Check Inputs First
    if (riwaq.sessionIdInput.value !== "" && riwaq.sessionIdInput.value.split("-").length === 5) {
        postData("joinSession", {
            userId: ID,
            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
            sessionId: riwaq.sessionIdInput.value
        }).then((sessionId) => {
            /* Just Reload Riwaq With SessionId */
            window.location.href = `riwaq?userId=${ID}&sessionId=${sessionId}`;
        });
    }
}
/* Exit Session */
riwaq.SessionExitBt.onclick = () => {
    /*TODO: exit Session Routine */
}
// Markers and Highlighter Button
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
/*                      */
/*    Message Input     */
/*                      */
/* Add file Button */
riwaq.addFileBt.onclick = () => {
    //TODO: Add File To Conversation like What'sApp
    //      Then When File like image loaded we put like on whiteboard using pens on top bar
    //  ومنعم خيار يكوت صفحة بيضا زي السبورة
    riwaq.addFileIn.click();
}
riwaq.addFileIn.oninput = () => {
    if (riwaq.addFileIn.value != "") {
        const File = riwaq.addFileIn.files[0].path;
        //TODO: Add File To Conversation like What'sApp
    }
}
/* Emoji Button */
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
document.addEventListener('click', event => {
    if (!riwaq.emojiPicker.contains(event.target) && !riwaq.emojiBt.contains(event.target)) {
        riwaq.emojiPicker.setAttribute("data-display", 'none');
        riwaq.emojiPicker.style.display = 'none';
    }
});