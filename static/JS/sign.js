import misc from "./misc.js";
import spinner from "../components/spinner.js";

/*************************
 * Theme based on user mode
 * ************************/
const isItDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
let themeSeed = "lightTheme";
isItDarkMode ? themeSeed = "darkTheme" : themeSeed = "lightTheme";
/*************
 * Main Routine
 * ***********/
window.onload = () => {
    sign.signWindow.style.filter = "blur(8px)";
    let preLoad = document.createElement("span");
    preLoad.className = "loader";
    preLoad.style.right = (window.innerWidth - 48) / 2 + 'px';
    preLoad.style.top = (window.innerHeight - 48) / 2 + 'px';
    document.body.append(preLoad);
    misc.loadTheme(themeSeed).then(() => {
        if (window.innerWidth <= 480) {
            document.getElementById("signUpBt3rd").className = "col pt-1";
            document.getElementById("signUpGoogleBt").style.marginBottom = "10px";
            sign.signWindow.style.height = (window.innerHeight / 100) * 70 + 'px';
        } else {
            sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        }
        /**********************
         * Adjust Wallpaper Color
         * *********************/
        isItDarkMode ? sign.loginWall.src = "assets/login_wall_dark.jpg" : "assets/login_wall.jpg";
        sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
        sign.passwordIcon.setAttribute("data-mode", "hide");
        /*******************
         * Remember Me Button
         * *****************/
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
        /************************
         * Keyboard Shortcut Enter
         * ********************/
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && sign.username.value && sign.password.value) {
                event.preventDefault();  // Prevent the form from submitting
                sign.loginBt.click()
            }
        });
    }).then(() => {
        /********************
         * Remove Preload Effect
         * ********************/
        sign.signWindow.style.filter = "blur(0px)";
        preLoad.remove();
    });
}
/********************
 * For Electron View
 * ******************/
window.onresize = () => {
    if (window.innerWidth > 480) {
        sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
    }
}
/**************
 * Login Button
 * ***********/
sign.signForm.addEventListener('submit', (event) => {
    event.preventDefault();// Stop auto-refresh
    sign.loginBt.innerHTML = spinner();
    const userName = sign.username.value;
    (async () => {
        let passWord = await misc.generateHashWeb(sign.password.value);
        /********************
         * Remember me button
         * *******************/
        if (localStorage.getItem("userName") != null &&
            userName === localStorage.getItem("userName") &&
            localStorage.getItem("userPass") != null) {
            passWord = localStorage.getItem("userPass").slice(3);
        }
        /********************
         * Check Credentials
         * *******************/
        if (!userName || !passWord) {
            console.log("fill Inputs first");
        }
        /***************
         * Authorize User
         * *************/
        else {
            misc.postData("login", {
                username: userName,
                password: passWord
            }).then((res) => {
                /************
                 * User Exist
                 * ***********/
                if (!res.status) {
                    // TODO: Send File from server
                    sign.signProfile.src = res.profile;
                    /*****************
                     * Save Credentials
                     * ***************/
                    if (sign.remeberMe.checked) {
                        localStorage.setItem("userName", userName);
                        localStorage.setItem("userPass", `|||${passWord}`);
                        localStorage.setItem("userProfile", `${res.profile}`);
                    } else {
                        /***************************************************************
                         * Put Hashed Password in Client Storage to Authenticate client
                         * **************************************************************/
                        localStorage.setItem("userPass", `|||${passWord}`);
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userProfile");
                    }
                    setTimeout(() => {
                        /******************
                         * Browser Interface
                         * *****************/
                        if (!misc.isElectron()) {
                            window.location.href = `https://${misc.DOMAIN}/iqraa?userId=${res.userID}`;
                        }
                        /******************
                         * Electron Interface
                         * *****************/
                        else {
                            window.IPC.openMainWindow(res.id);
                            window.close();
                        }
                    }, 1500);
                }
                /************
                 * User Not Exist
                 * ***********/
                else {
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
    })();
})
//needed only because font "Moharram" error when enter data!
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
/*******************
 * Show/Hide Password
 * ******************/
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
/***************
 * Sign-Up Manual
 * **************/
sign.signUpBt.onclick = () => {
    window.location.href = `https://${misc.DOMAIN}/signup`;
}
/**************************
 * Sign-Up Using Google
 * *************************/
sign.signUpGoogleBt.onclick = () => {
    // oAuth_Google();
    console.log("oAuth_Google()");
}
/**************************
 * TODO: Sign-Up Using Microsoft
 * *************************/
sign.signUpMSBt.onclick = () => {
    // oAuth_MS();
    console.log("oAuth_MS()");
}