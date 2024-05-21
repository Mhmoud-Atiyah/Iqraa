const controlBt = document.getElementsByClassName("form-control");
const selectBt = document.getElementsByClassName("form-select");
const configSwitch = document.getElementsByClassName("form-check-input");
const socialBt = document.getElementsByClassName("social-btn");

// SOME SPEICAL DEFINE
const max = 1000; // maximum number of users
const min = 1;// minimum number of users

var user_Data =
{
    "id": "",
    "firstName": "",
    "lasttName": "",
    "age": "",
    "Country": "",
    "gender": "",
    "account": "",
    "profile": "",
    "password": "",
    "about": "",
    "favouriteBooks": [],
    "interests": []
};
// help function
function getSelectValues(select) {
    var selected = [];
    for (var option of select.options) {
        if (option.selected) {
            selected.push(option.value);
        }
    }
    return selected;
}
// Load Data
window.onload = () => {
    fetch('http://localhost:1999/signUp')
        .then(response => response.json())
        .then(data => {
            let location = data["location"];
            let genres = data["genres"];
            let interests = data["interests"];
            Object.keys(location).forEach(country => {
                let opt = document.createElement("option");
                opt.innerText = country;
                selectBt[0].append(opt);
            });
            for (let index = 0; index < genres.length; index++) {
                let opt = document.createElement("option");
                opt.innerText = genres[index];
                selectBt[2].append(opt);
            }
            for (let index = 0; index < interests.length; index++) {
                let opt = document.createElement("option");
                opt.innerText = interests[index];
                selectBt[3].append(opt);
            }
        })
        .catch(error => {
            console.error(error);
        });
}
// Assure Two passwords identical
controlBt[6].addEventListener('change', () => {
    if (controlBt[6].value !== controlBt[5].value) {
        controlBt[5].style.border = controlBt[6].style.border = "solid red 1px";
        controlBt[5].title = controlBt[5].title = "كلمات المرور غير متطابقة"
    } else {
        controlBt[5].style.border = controlBt[6].style.border = "";
    };
});

document.getElementById("login-window").addEventListener('click', async () => {
    // check if required values exist
    if (controlBt[0].value === "" // firstName
        || controlBt[1].value === "" // lastName
        || controlBt[2].value === "" // Age
        || controlBt[3].value === "" // Account
        || controlBt[4].value === "" // Profile
        || controlBt[5].value === "" // Password
        || selectBt[0].value === "" // Country
        || selectBt[1].value === "" // Gender
    ) {
        window.alert("\nاملاء البيانات المطلوبة أولاً \n")
        return;
    }
    user_Data.id = `${Math.floor(Math.random() * (max - min) + min)}`;
    // first name
    user_Data.firstName = controlBt[0].value;
    // last name
    user_Data.lasttName = controlBt[1].value;
    // Age
    user_Data.age = controlBt[2].value;
    // Country
    user_Data.Country = selectBt[0].value;
    // Gender
    user_Data.gender = selectBt[1].value;
    // profile
    user_Data.profile = controlBt[4].files[0].path;
    // account
    if (controlBt[3].value) {
        user_Data.account = controlBt[3].value;
    } else {
        user_Data.account = user_Data.id + "@qiraa";
    }
    // password
    user_Data.password = controlBt[5].value;
    // about
    user_Data.about = controlBt[7].value;
    // favourite genres
    user_Data.favouriteBooks = getSelectValues(selectBt[2]);
    // interests
    user_Data.interests = getSelectValues(selectBt[3]);
    user_Data_ = `
    ${user_Data.id}|
    ${user_Data.firstName}|
    ${user_Data.lasttName}|
    ${user_Data.age}|
    ${user_Data.Country}|
    ${user_Data.gender}|
    ${user_Data.account}|
    ${user_Data.profile}|
    ${user_Data.password}|
    ${user_Data.about}|
    ${getSelectValues(selectBt[2]).join("-")}|
    ${getSelectValues(selectBt[3]).join("-")}|
    `
    fetch(`http://localhost:1999/createUser/${user_Data_}`);
    document.body.innerHTML = "";
    //TODO: اعمل صفحة بسيطة انك سجلت باسم كذا وهتقفل ذاتي بعد 5 ثواني أو تقدر تقفل الصفحة دي
    let TODO = document.createElement("h1").innerText = "You Can Close this Window Now!";
    document.append(TODO);
    setTimeout(() => {
        window.close();
    }, 5000);
})