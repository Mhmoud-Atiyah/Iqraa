/****
 * Dynamically Create User on Room
 * ***/
import misc from '../JS/misc.js'

export default function riwaqUser(sessionData) {
    misc.postData('sessionUsers', {
        userId: misc.ID,
        hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
        userIDs: sessionData.partiesids
    }).then(res => {
        if (!res.status) {
            console.log(res.msg);
            const sessionUsers = res.data;
            for (let i = 0; i < sessionUsers.length; i++) {
                let state_, user = document.createElement('div');
                if (sessionUsers[i].id === sessionData.speaker) {
                    state_ = `<span class="conversationUserStatus"><i class="fa-solid fa-microphone-lines me-2 text-warning"></i>يتكلم</span>`;
                } else if (sessionUsers[i].id === sessionData.adminid) {
                    state_ = `<span class="conversationUserStatus">المضيف</span>`;
                } else {
                    state_ = `<span class="conversationUserStatus"><i class="fa-solid fa-microphone-lines-slash me-1 text-danger"></i>مستمع</span>`;
                }
                user.className = "col-md-3";
                user.innerHTML = `
                    <div class="conversationUser" data-id="${sessionUsers[i].id}">
                        <img src="${sessionUsers[i].profile}" alt="${sessionUsers[i].fullname}" class="conversationUserImg">
                        <div class="conversationUserTitle"><span class="conversationUserName fw-bold">${sessionUsers[i].fullname}</span>${state_}</div>
                    </div>`;
                document.getElementById("conversationUsers").append(user);
            }
        }
        /***************
         * User Not Authorized
         * **************/
        else {
            //TODO: showHideSecondaryWindow() with error message
            console.error(res.msg);
        }
    }).then(() => {
        /***
         * Add Event Listener
         * */
        const users = document.getElementsByClassName('conversationUser');
        for (let i = 0; i < users.length; i++) {
            users[i].onclick = () => {
                // TODO: Decide the behaviour
            }
        }
    });
}