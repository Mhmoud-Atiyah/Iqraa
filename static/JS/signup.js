/**************
 *TODO: On Create New User Create Directory for him in disk with Quota based on Price plan
 * ************/
// Global Class For All Inputs
const FormInput = document.getElementsByClassName("form-control");
const FormSelect = document.getElementsByClassName("form-select");

window.onload = () => {
    loadTheme("lightTheme").then(r => {
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
// Retrive Countries List Data
getData("countryList").then(data => {
    let location = data["location"];
    Object.keys(location).forEach(country => {
        let opt = document.createElement("option");
        opt.innerText = country;
        document.getElementById("Country").append(opt);
    });
}).catch(error => {
    console.error(error);
});
// Profile Listener
document.getElementById("SUsignProfileImg").onclick = () => {
    document.getElementById("browse_SUsignProfileImg").click();
}
document.getElementById("browse_SUsignProfileImg").oninput = () => {
    if (document.getElementById("browse_SUsignProfileImg").value != "") {
        document.getElementById("SUsignProfileImg").src = document.getElementById("browse_SUsignProfileImg").files[0].path;
    }
}
// Date Foramtter
document.getElementById("DOB").oninput = () => {
    document.getElementById("DOB").style.fontFamily = "NumberFont";
};
// Assure Two passwords identical
FormInput[6].addEventListener('change', () => {
    if (FormInput[6].value !== FormInput[5].value) {
        FormInput[5].style.border = FormInput[6].style.border = "solid red 1px";
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
document.getElementById("signUpLogin").onclick = () => {
    window.location.reload();
}
/*TODO: Sign-Up Using Google */
document.getElementById("signUpGoogleBt").onclick = () => {
    // oAuth_Google();
    console.log("oAuth_Google()");
}
/*TODO: Sign-Up Using Microsoft */
document.getElementById("signUpMSBt").onclick = () => {
    // oAuth_MS();
    console.log("oAuth_MS()");
}
// Register New User
document.getElementById("signUpForm").addEventListener('submit', (event) => {
    event.preventDefault();// Stop auto-refresh
    document.getElementById("signBt").innerHTML = spinner;
    //TODO: Post Data to Database
    postData('createUser', {
        id: `${Math.floor(Math.random() * (max - min) + min)}`,
        firstName: FormInput[1].value,
        lastName: FormInput[2].value,
        dob: FormInput[4].value,
        country: FormSelect[1].value,
        gender: FormSelect[0].value,
        account: FormInput[3].value,
        profile: (document.getElementById("browse_SUsignProfileImg").files[0] == null) ?
            "assets/profile.png" :
            document.getElementById("browse_SUsignProfileImg").files[0].path,
        password: FormInput[5].value // TODO: In future Will use https (encrypted) on Internet Connection
    }).then(() => {
        window.close();
    })
})