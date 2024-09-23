import misc from "./misc.js"
import spinner from "../components/spinner.js"
import googleSignUp from "./auth/google.js"

/*************************
 * Theme based on user mode
 * ************************/
const isItDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
let themeSeed = "lightTheme";
isItDarkMode ? themeSeed = "darkTheme" : themeSeed = "lightTheme";
/**************
 *TODO: On Create New User Create Directory for him in disk with Quota based on Price plan
 * ************/
// Global Class For All Inputs
const FormInput = document.getElementsByClassName("form-control");
const FormSelect = document.getElementsByClassName("form-select");

window.onload = () => {
    sign.signWindow.style.filter = "blur(8px)";
    let preLoad = document.createElement("span");
    preLoad.className = "loader";
    preLoad.style.right = (window.innerWidth - 48) / 2 + 'px';
    preLoad.style.top = (window.innerHeight - 48) / 2 + 'px';
    document.body.append(preLoad);
    misc.loadTheme(themeSeed).then(r => {
        if (window.innerWidth <= 480) {
            document.getElementById("signUpBt3rd").className = "col pt-1";
            document.getElementById("AccountAndGender").className = "col";
            document.getElementById("AccountInput").className = "col-12 pb-2";
            document.getElementById("GenderInput").className = "pb-2";
            document.getElementById("signUpGoogleBt").style.marginBottom = "10px";
            sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        } else {
            sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
        }
        sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
        sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && FormInput[3].value && FormInput[5].value) {
                event.preventDefault();  // Prevent the form from submitting
                document.getElementById('signBt').click()
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
/***************************
 * Retrieve Countries List
 * *************************/
misc.getData("countryList").then(data => {
    let location = data["location"];
    Object.keys(location).forEach(country => {
        let opt = document.createElement("option");
        opt.innerText = country;
        document.getElementById("Country").append(opt);
    });
}).catch(error => {
    console.error(error);
});
/*****************
 * Profile Select
 * ****************/
document.getElementById("signProfileImg").onclick = () => {
    document.getElementById("browse_signProfileImg").click();
}
let profile = document.getElementById("browse_signProfileImg").files[0] || "assets/profile.png";
document.getElementById("browse_signProfileImg").onchange = (evt) => {
    profile = evt.target.files[0];
    if (profile) {
        document.getElementById("signProfileImg").src = URL.createObjectURL(profile);
    }
}
/***************
 * Date Formatter
 * **************/
document.getElementById("DOB").oninput = () => {
    document.getElementById("DOB").style.fontFamily = "NumberFont";
};
/****************
 * Match Passwords
 * ***************/
FormInput[6].addEventListener('change', () => {
    if (FormInput[6].value !== FormInput[5].value) {
        FormInput[5].style.border = FormInput[6].style.border = "solid red 1px";
        FormInput[5].value = "";
        FormInput[6].value = "";
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.role = 'alert';
        alertDiv.style.fontFamily = "Moharram"
        alertDiv.innerHTML = `
                        <span>كلمات المرور غير متطابقة</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="font-size:12px"></button>`;
        sign.alertPlaceholder.appendChild(alertDiv);
        // Remove the alert after a few seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('hide');
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
            FormInput[5].style.border = FormInput[6].style.border = "";
        }, 3000);
    }
});
/*****************************
 * TODO: Sign-Up Using Google
 * ****************************/
document.getElementById("signUpGoogleBt").onclick = () => {
    // oAuth_Google();
    console.log("oAuth_Google()");
}
/*****************************
 * TODO: Sign-Up Using Microsoft
 * ****************************/
document.getElementById("signUpMSBt").onclick = () => {
    // oAuth_MS();
    console.log("oAuth_MS()");
}
/*****************
 * Register New User
 * ***************/
document.getElementById("signUpForm").addEventListener('submit', (event) => {
    event.preventDefault();// Stop auto-refresh
    /**************
     * Password Validation
     * *************/
    if (!misc.validatePassword(FormInput[5].value)) {
        FormInput[5].style.border = FormInput[6].style.border = "solid var(--App-redColor) 1px";
        FormInput[5].value = "";
        FormInput[6].value = "";
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.role = 'alert';
        alertDiv.style.fontFamily = "Moharram"
        alertDiv.innerHTML = `
                        <span>يجب ان تحتوي كلمة المرور على ]أرقام - حروف - اكثر من ${misc.convertToArabicNumeral(8)} حروف[</span>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="font-size:12px"></button>`;
        sign.alertPlaceholder.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('hide');
            alertDiv.addEventListener('transitionend', () => alertDiv.remove());
            FormInput[5].style.border = FormInput[6].style.border = "";
        }, 3000);
        return;
    }
    /**********
     * Post Data
     * ***********/
    document.getElementById("signBt").innerHTML = spinner();
    (async () => {
        misc.postForm('signup', {
            firstName: FormInput[1].value,
            lastName: FormInput[2].value,
            account: FormInput[3].value,
            gender: FormSelect[0].value,
            dob: FormInput[4].value,
            country: FormSelect[1].value,
            password: await misc.generateHashWeb(FormInput[5].value)
        }, profile).then((res) => {
            /**************
             * Print Response
             * *************/
            if (!res.status) {
                console.log(res.msg);
                document.getElementById("signInBt").click();
            } else {
                console.log(res.msg);
            }
            /*********************
             * Close Electron Window
             * ********************/
            if (misc.isElectron()) {
                window.close();
            }

        })
    })()
})