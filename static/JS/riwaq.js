import '../../node_modules/emoji-picker-element/index.js';

const ID = getQueryParams().userId; // get ID of User Open The Window
// Main Routine On start
window.onload = () => {
    getData("loadConfig").then((config) => { // Global Config not User Config
        /* Dark mode setting */
        if (config.mode === "dark") { // Now is Dark
            loadTheme("darkTheme");
            riwaq.emojiPicker.className.replace('light', 'dark');
        } else {    // Now is Light
            loadTheme("lightTheme");
            riwaq.emojiPicker.className.replace('dark', 'light');
        }
        /* Microphone Setting */
        if (config.microphone === "on") { // microphone is On
            riwaq.micIcon.className = "fa-solid fa-microphone";
            riwaq.micIcon.setAttribute("data-mode", "on");
        } else {    // microphone is Off
            riwaq.micIcon.className = "fa-solid fa-microphone-slash";
            riwaq.micIcon.setAttribute("data-mode", "off");
        }
        /* speakerIcon Setting */
        if (config.speaker === "on") { // speaker is On
            riwaq.speakerIcon.className = "fa-solid fa-volume-high";
            riwaq.speakerIcon.setAttribute("data-mode", "on");
        } else {    // speaker is Off
            riwaq.speakerIcon.className = "fa-solid fa-volume-xmark";
            riwaq.speakerIcon.setAttribute("data-mode", "off");
        }
        /* CameraIcon Setting */
        if (config.camera === "on") { // camera is On
            riwaq.cameraIcon.className = "fa-solid fa-video";
            riwaq.cameraIcon.setAttribute("data-mode", "on");
        } else {    // camera is Off
            riwaq.cameraIcon.className = "fa-solid fa-video-slash";
            riwaq.cameraIcon.setAttribute("data-mode", "off");
        }
    })
    getData(`userData/${ID}`).then((userData) => { // Current User Data
        if (userData.riwaqnew === "true") { // First look riwaq
            let element =
                `
                <div class="newSection position-relative overflow-hidden m-md-2 text-center rounded" style="border: solid 1px var(--App-panelBorderColor);">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: arbicDecorative;">النقاش يُثري الفكرَ ويرتقي <br> والفهمُ ينمو بفضلِ التجاربِ</h1>
                        <h1 class="display-4 fw-normal">ما زال الرواق <span class="text-danger">فارغ</span></h1>
                        <p class="lead fw-normal fs-3">يمكنك إستخدام الرواق حسب رغبتك<br></p>
                        <p class="lead fw-normal fs-3">فقط اضغط على الزر بالأسفل لبدأ رواق جديد<br>
                     كما يمكنك  الإنضام الى رواق موجود</p>
                    </div>
                </div>
            `;
            let Div = document.createElement('div');
            Div.id = "mainChild";
            Div.innerHTML = element;
            mainView.append(Div);
        };
        accountBt.innerText = userData.firstName + " " + userData.lasttName;
        profileBt.src = userData.profile;
        profileBt.alt = userData.account;
    })
    document.getElementById("main").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("mainSide").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("mainSide").style.width = window.innerWidth - 220 + 'px';
    document.getElementById("Side").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("SessionNotes").style.height = window.innerHeight - 350 + 'px';
    document.getElementById("conversation").style.height = window.innerHeight - 110 + 'px';
    document.getElementById("conversation").style.width = window.innerWidth - 220 + 'px';
    document.getElementById("messageInputText_in").style.width = window.innerWidth - 412 + 'px';
    //TODO: 
    // if (conversationUsers >= 32 or some big value) {
    // conversationUsers.window.height = "number" px;
    // }else{
    //     // conversationUsers.windows.height = "auto";
    //}
    riwaq.initModal.style.display = "none";
    riwaq.emojiPicker.setAttribute("data-display", 'none');
    riwaq.UsersWindow.setAttribute("data-display", 'none');
    riwaq.initBt.setAttribute("data-show", "hide");
    riwaq.markersBt.setAttribute("data-show", "hide");
    riwaq.UsersWindow.style.display = "none";
}
// Routine Applied On Resize
window.onresize = () => {
    document.getElementById("main").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("mainSide").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("mainSide").style.width = window.innerWidth - 220 + 'px';
    document.getElementById("Side").style.height = window.innerHeight - 50 + 'px';
    document.getElementById("SessionNotes").style.height = window.innerHeight - 350 + 'px';
    document.getElementById("conversation").style.height = window.innerHeight - 110 + 'px';
    document.getElementById("conversation").style.width = window.innerWidth - 220 + 'px';
    document.getElementById("messageInputText_in").style.width = window.innerWidth - 412 + 'px';
}
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

//TODO: Turn Mic or Speaker for Iqraa Application
// Microphone Button
riwaq.micIcon.onclick = () => {
    if (riwaq.micIcon.getAttribute("data-mode") === "on") {
        getData(`editConfig/microphone|off`).then((res) => {
            if (res) {
                riwaq.micIcon.setAttribute("data-mode", "off");
                riwaq.micIcon.className = "fa-solid fa-microphone-slash";
            }
        });
    } else {
        getData(`editConfig/microphone|on`).then((res) => {
            if (res) {
                riwaq.micIcon.setAttribute("data-mode", "on");
                riwaq.micIcon.className = "fa-solid fa-microphone";
            }
        });
    };
}
// Speaker Button
riwaq.speakerIcon.onclick = () => {
    if (riwaq.speakerIcon.getAttribute("data-mode") === "on") {
        getData(`editConfig/speaker|off`).then((res) => {
            if (res) {
                riwaq.speakerIcon.setAttribute("data-mode", "off");
                riwaq.speakerIcon.className = "fa-solid fa-volume-xmark";
            }
        });
    } else {
        getData(`editConfig/speaker|on`).then((res) => {
            if (res) {
                riwaq.speakerIcon.setAttribute("data-mode", "on");
                riwaq.speakerIcon.className = "fa-solid fa-volume-high";
            }
        });
    }
}
riwaq.cameraIcon.onclick = () => {
    if (riwaq.cameraIcon.getAttribute("data-mode") === "on") {
        getData(`editConfig/camera|off`).then((res) => {
            if (res) {
                riwaq.cameraIcon.setAttribute("data-mode", "off");
                riwaq.cameraIcon.className = "fa-solid fa-video-slash";
            }
        });
    } else {
        getData(`editConfig/camera|on`).then((res) => {
            if (res) {
                riwaq.cameraIcon.setAttribute("data-mode", "on");
                riwaq.cameraIcon.className = "fa-solid fa-video";
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
// Init Session Button
// TODO: on session going this button will red X button for Exit!
riwaq.initBt.onclick = () => {
    if (riwaq.initBt.getAttribute("data-show") === "show") {
        riwaq.initBt.setAttribute("data-show", "hide");
        riwaq.initModal.style.display = "none";
        riwaq.initIcon.className = "fa-solid fa-users";
    } else {
        riwaq.initBt.setAttribute("data-show", "show");
        riwaq.initModal.style.display = "block";
        setTimeout(() => {
            riwaq.initIcon.className = "fa-solid fa-xmark";
        }, 1800);
    }
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
}

//
// Message Input 
//
/* Add file Button*/
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
