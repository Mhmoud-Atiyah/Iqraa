// SOME SPEICAL DEFINE
const max = 1000000; // maximum number of users
const min = 1;// minimum number of users

// Front Responsive Look
window.onload = () => {
    loadTheme("lightTheme");
    sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
    sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
    sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
    sign.passwordIcon.setAttribute("data-mode", "hide");
    // Remeber Me Button
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
}
window.onresize = () => {
    sign.signWindow.style.height = (window.innerHeight / 100) * 80 + 'px';
    sign.signForm.style.height = (window.innerHeight / 100) * 80 + 'px';
    sign.signWindow.style.width = (window.innerWidth / 100) * 80 + 'px';
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
    userName = sign.username.value;
    if (localStorage.getItem("userName") != null &&
        userName == localStorage.getItem("userName") &&
        localStorage.getItem("userPass") != null) {
        passWord = localStorage.getItem("userPass");
    } else {
        passWord = sign.password.value;
    }
    if (!userName || !passWord) {
        console.log("fill Inputs first");
    } else {
        postData("login", {
            username: userName,
            password: passWord
        }).then((res) => {
            if (res.id) { // If returned ID
                sign.signProfile.src = res.profile;
                if (sign.remeberMe.checked) {
                    localStorage.setItem("userName", userName);
                    localStorage.setItem("userPass", `|||${res.encryptedPass}`);
                    localStorage.setItem("userProfile", `${res.profile}`);
                } else {
                    localStorage.removeItem("userName");
                    localStorage.removeItem("userPass");
                    localStorage.removeItem("userProfile");
                }
                setTimeout(() => {
                    window.IPC.openMainWindow(res.id);
                    window.close();
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
/*  Sign-Up Button */
sign.signUpBt.onclick = () => {
    document.querySelector("form").remove();
    let form = document.createElement("form");
    form.innerHTML = `
                        <!-- Profile -->
                        <div class="row mb-2" id="signProfile">
                            <div class="col">
                                <img src="assets/profile.png" class="cursorBt border rounded-circle p-1" id="SUsignProfileImg"
                                    alt="صورة المستخدم" height="80px" width="80px" title="صورة المستخدم">
                            </div>
                        </div>
                        <input class="form-control" type="file" style="display:none" id="browse_SUsignProfileImg" accept=".png,.jpg">
                        <!-- Name -->
                        <div class="row mb-2">
                            <div class="col">
                                <input type="text" class="form-control" placeholder="الاسم الأول" required>
                            </div>
                            <div class="col">
                                <input type="text" class="form-control" placeholder="اسم العائلة" required>
                            </div>
                        </div>
                        <!-- Account and Gender -->
                        <div class="row mb-2">
                            <div class="col-9">
                                <input type="email" class="form-control" placeholder="البريد الإلكتروني" required>
                            </div>
                            <div class="col">
                                <select class="form-select" id="gender" required style="cursor:pointer">
                                    <option value="" hidden>الجنس</option>
                                    <option>ذكر</option>
                                    <option>أنثى</option>
                                </select>
                            </div>
                            </div>
                        <!-- DOB and Country -->
                        <div class="row mb-2">
                            <div class="col">
                                <input type="text" id="DOB" class="form-control" required placeholder="تاريخ الميلاد"
                                    onfocus="(this.type='date')" onblur="(this.type='text')">
                            </div>
                            <div class="col">
                                <select class="form-select" id="Country" required style="cursor:pointer">
                                    <option value="" hidden>البلد</option>
                                </select>
                            </div>
                        </div>
                        <!-- Password -->
                        <div class="row mb-2">
                            <div class="col">
                                <input type="password" class="form-control" required placeholder="كلمة المرور">
                            </div>
                            <div class="col">
                                <input type="password" class="form-control" required placeholder="تأكيد كلمة المرور">
                            </div>
                        </div>
                        <!-- read Conditions and Terms -->
                        <div class="form-check mb-2">
                            <input class="form-check-input float-end me-2 ms-2" type="checkbox" value=""
                                style="cursor: pointer;" id="readConditions" required>
                            <label class="form-check-label" for="readConditions"
                                style="position: relative;top: -6px;font-size: 24px;">لقد قرأت ووافقت على
                                <u class="ms-1 me-1">البنود</u>
                                و<u class="ms-1 me-1">حالة الخدمة</u>
                                و<b class="ms-1 me-1">كيفية الاستخدام</b>.
                            </label>
                        </div>
                        <!-- Sign up Button -->
                        <div class="row m-0">
                            <button type="submit" data-mdb-button-init="" data-mdb-ripple-init="" id="signBt"
                                class="rounded border fw-bold pt-2 pb-2" data-mdb-button-initialized="true"
                                style="word-spacing: 2px;text-align: center;font-size: 18px;background-color: var(--App-panelBorderColor);"
                                aria-pressed="true">تسجيل مستخدم جديد</button>
                        </div>
                        <!-- Sign in Option -->
                        <div class="row" style="text-align: center;font-size: 22px;height: 40px;">
                            <p>لديك حساب بالفعل<span style="font-family:NumberFont;position:relative;top:4px;right:1px">؟</span>
                            &nbsp;<a href="#" id="signUpLogin" style="color: var(--App-textColor);"><b><u>
                            تسجيل الدخول</u></b></a></p>
                        </div>
                        <!-- Or Divider -->
                        <div class="divider d-flex align-items-center mb-2">
                            <p class="text-center fw-bold mx-3 mb-0 text-muted"
                                style="font-size: 22px;letter-spacing: 2px;">أو</p>
                        </div>
                        <!-- Sign up Use 3rd=party -->
                        <div class="row mb-2">
                            <div class="col">
                                <div type="submit" data-mdb-button-init="" data-mdb-ripple-init="" id="signUpGoogleBt"
                                    class="rounded border fw-bold pt-2 pb-2" data-mdb-button-initialized="true"
                                    style="word-spacing: 2px;text-align: center;font-size: 18px;background-color: var(--App-panelBorderColor);"
                                    aria-pressed="true">
                                    التسجيل بإستخدام جوجل
                                    <img src="assets/google_logo.png" alt="" height="18px" class="me-2">
                                </div>
                            </div>
                            <div class="col">
                                <div type="submit" data-mdb-button-init="" data-mdb-ripple-init="" id="signUpMSBt"
                                    class="rounded border fw-bold pt-2 pb-2" data-mdb-button-initialized="true"
                                    style="word-spacing: 2px;text-align: center;font-size: 18px;background-color: var(--App-panelBorderColor);"
                                    aria-pressed="true">
                                    التسجيل بإستخدام مايكروسوفت
                                    <img src="assets/microsoft_logo.png" alt="" height="18px" class="me-2">
                                </div>
                            </div>
                        </div>
                    `;
    form.id = "signUpForm";
    sign.signForm.append(form);
    // Global Class For All Inputs
    var FormInput = document.getElementsByClassName("form-control");
    var FormSelect = document.getElementsByClassName("form-select");
    // Retrive Countries List Data
    fetch('http://localhost:1999/signUp').then(response => response.json()).then(data => {
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

    // TODO:------------------------------- DELETE IN FUTURE -----------------
    FormInput[5].oninput = () => {
        if (FormInput[5].value != "") {
            FormInput[5].style.fontFamily = "TheYearofTheCamelLight";
            FormInput[5].style.height = "44px";
            FormInput[5].style.padding = "0px";
            FormInput[5].style.paddingTop = "10px";
            FormInput[5].style.paddingRight = "10px";
        } else {
            FormInput[5].style.fontFamily = "";
            FormInput[5].style.height = "";
            FormInput[5].style.padding = "";
            FormInput[5].style.paddingTop = "";
            FormInput[5].style.paddingRight = "";
        }
    }
    FormInput[6].oninput = () => {
        if (FormInput[6].value != "") {
            FormInput[6].style.fontFamily = "TheYearofTheCamelLight";
            FormInput[6].style.height = "44px";
            FormInput[6].style.padding = "0px";
            FormInput[6].style.paddingTop = "10px";
            FormInput[6].style.paddingRight = "10px";
        } else {
            FormInput[6].style.fontFamily = "";
            FormInput[6].style.height = "";
            FormInput[6].style.padding = "";
            FormInput[6].style.paddingTop = "";
            FormInput[6].style.paddingRight = "";
        }
    }
    // ------------------------------------ DELETE IN FUTURE -----------------

    // On login from Signup
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
        // Post Data to Database
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