// SOME SPEICAL DEFINE
const max = 1000000; // maximum number of users
const min = 1;// minimum number of users
// Front Responsive Look
window.onload = () => {
    loadTheme("lightTheme").then(r => {
        if (window.innerWidth <= 480) {
            document.getElementById("signUpBt3rd").className = "col pt-1";
            document.getElementById("signUpGoogleBt").style.marginBottom = "10px";
            sign.signWindow.style.height = (window.innerHeight / 100) * 70 + 'px';
        } else {
            sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        }
        sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
        sign.passwordIcon.setAttribute("data-mode", "hide");
        // Remember Me Button
        if (localStorage.getItem("userName") != null && localStorage.getItem("userPass") != null) {
            sign.remeberMe.checked = "true";
            sign.username.value = localStorage.getItem("userName");
            sign.signProfile.src = localStorage.getItem("userProfile");
            sign.password.value = "-------------";
            sign.password.style.fontFamily = "TheYearofTheCamelLight";
            sign.password.style.height = "44px";
            sign.password.style.padding = "0px";
            sign.password.style.paddingTop = "10px";
            sign.password.style.paddingRight = "10px";

        }
        // TODO: no todo just ask ? put listener general or on fill inputs
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && sign.username.value && sign.password.value) {
                event.preventDefault();  // Prevent the form from submitting
                sign.loginBt.click()
            }
        });
    });
}
window.onresize = () => {
    if (window.innerWidth > 480) {
        sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
    }
}
/* Login Button */
const spinner = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="84" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
        <circle cx="16" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0.2s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0.2s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
        <circle cx="50" cy="50" r="10" fill="#000">
            <animate attributeName="r" from="10" to="10" begin="0.4s" dur="0.8s" values="10;5;10" calcMode="linear" repeatCount="indefinite"></animate>
            <animate attributeName="fill-opacity" from="1" to="1" begin="0.4s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"></animate>
        </circle>
    </svg>
    `;
sign.signForm.addEventListener('submit', (event) => {
    event.preventDefault();// Stop auto-refresh
    sign.loginBt.innerHTML = spinner;
    const userName = sign.username.value;
    //TODO: Check this
    let passWord = sign.password.value;
    if (localStorage.getItem("userName") != null &&
        userName === localStorage.getItem("userName") &&
        localStorage.getItem("userPass") != null) {
        passWord = localStorage.getItem("userPass");
    }
    if (!userName || !passWord) {
        console.log("fill Inputs first");
    } else {
        postData("login", {
            username: userName,
            password: passWord
        }).then((res) => {
            if (res.id != null) { // If returned ID
                sign.signProfile.src = res.profile;
                if (sign.remeberMe.checked) {
                    localStorage.setItem("userName", userName);
                    localStorage.setItem("userPass", `|||${res.pass}`);
                    localStorage.setItem("userProfile", `${res.profile}`);
                } else {
                    /* Put Hashed Password in Client Storage to Authenticate client */
                    localStorage.setItem("userPass", `|||${res.pass}`);
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userProfile");
                }
                setTimeout(() => {
                    if (!isElectron()){ // Browser Interface
                        window.location.href = `https://${DOMAIN}/iqraa?userId=${res.id}`;
                    } else { // Electron App
                        window.IPC.openMainWindow(res.id);
                        window.close();
                    }
                }, 1500);
            } else {
                sign.loginBt.innerHTML = `تسجيل الدخول`;
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                alertDiv.role = 'alert';
                alertDiv.style.fontFamily = "Moharram"
                alertDiv.innerHTML = `
                        <span> أنت غير مسجل أو بياناتك خاطئة </span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
                            style="font-size:12px"
                        >
                        </button>`;
                sign.alertPlaceholder.appendChild(alertDiv);
                sign.signUpBt.className = "rounded border border-warning fw-bold pt-2 pb-2";
                // Remove the alert after a few seconds
                setTimeout(() => {
                    alertDiv.classList.remove('show');
                    alertDiv.classList.add('hide');
                    alertDiv.addEventListener('transitionend', () => alertDiv.remove());
                    sign.signUpBt.className = "rounded border fw-bold pt-2 pb-2";
                }, 5000);
            }
        });
    }
})
//TODO: needed only because font "Moharram" error when enter data!
sign.password.oninput = () => {
    if (sign.password.value != "") {
        sign.password.style.fontFamily = "TheYearofTheCamelLight";
        sign.password.style.height = "44px";
        sign.password.style.padding = "0px";
        sign.password.style.paddingTop = "10px";
        sign.password.style.paddingRight = "10px";
    } else {
        sign.password.style.fontFamily = "";
        sign.password.style.height = "";
        sign.password.style.padding = "";
        sign.password.style.paddingTop = "";
        sign.password.style.paddingRight = "";
    }
}
sign.passwordIcon.onclick = () => {
    if (sign.passwordIcon.getAttribute("data-mode") === "hide") {
        sign.passwordIcon.setAttribute("data-mode", "show");
        sign.passwordIcon.className = "fa-regular fa-eye";
        sign.passwordIcon.style.left = "15px"
        sign.password.type = "text";
    } else {
        sign.passwordIcon.setAttribute("data-mode", "hide");
        sign.passwordIcon.className = "fa-regular fa-eye-slash";
        sign.passwordIcon.style.left = ""
        sign.password.type = "password";
    }
}
/*TODO: Sign-Up Using Google */
sign.signUpGoogleBt.onclick = () => {
    // oAuth_Google();
    console.log("oAuth_Google()");
}
/*TODO: Sign-Up Using Microsoft */
sign.signUpMSBt.onclick = () => {
    // oAuth_MS();
    console.log("oAuth_MS()");
}