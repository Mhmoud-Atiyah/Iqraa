const ID = getQueryParams().userId;
/* import createLibrarySection and createLibraryBook */
import createLibrarySection from '../components/librarySection.js'
// Main Routine On start
window.onload = () => {
    getData(`loadConfig/${ID}`).then((config) => { // Global Config not User Config
        /* Dark mode setting */
        config.thememode === "dark" ? loadTheme("darkTheme") : loadTheme("lightTheme");
        // First Time Library
        if (config.newlibrary) { // First look Library
            let element = `<div class="newSection position-relative overflow-hidden m-md-2 text-center rounded p-4" style="border: solid 1px var(--App-panelBorderColor);font-family: Moharram, serif">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: DecorationFont2,serif;"> وأرضك من حلي التاريخ رَق<br> سماؤك من حلى الماضي كتاب</h1>
                        <h1 class="display-4 fw-normal">ما زالت المكتبة <span class="text-danger">فارغة</span></h1>
                        <p class="lead fw-normal fs-3">يمكنك إستخدام المكتبة كفرد أو مؤسسة<br></p>
                        <p class="lead fw-normal fs-3">فقط اضغط على الزر بالأسفل لتكوين مكتبتك<br>
                     كما يمكنك الإنضمام إلى مكتبة عن طريق رقمها التعريفي</p>
                    </div>
                </div>`;
            let Div = document.createElement('div');
            Div.id = "mainChild";
            Div.innerHTML = element;
            mainView.append(Div);
        }
        accountBt.innerText = config.fname + " " + config.lname;
        profileBt.src = config.profile;
        profileBt.alt = config.account;
    })
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
    library.initModal.style.display = "none";
    library.initBt.setAttribute("data-show", "hide");
    library.LibraryInfoBt.setAttribute("data-show", "hide");

    createLibrarySection("الكتب العربية الأكثر مبيعًا", [
        {
            id: 8507947,
            src: "https://www.shoroukbookstores.com/images/Books/thumb/9789770937570.jpg",
            title: "علاقات خطيرة",
            author: "محمد طه",
            price: "134",
            currency: "د.ق"
        }
    ]);
    /* Open Book */
    for (let index = 0; index < openBookBt.length; index++) {
        openBookBt[index].onclick = () => {
            if (!isElectron()) {
                window.location.href = `https://${DOMAIN}/bookview?userId=${ID}&bookId=${openBookBt[index].getAttribute("data-id")}`;
            } else {
                window.IPC.openBookWindow(openBookBt[index].getAttribute("data-id"), ID);
            }
        }
    }
}
/* Misc Theme */
library.libraryNameInput.onclick = () => {
    library.libraryNameField.classList.add("mb-2");
    library.libraryIDField.style.display = "none";
    library.joinLibraryBt.classList.add("disabled");
}
library.libraryIDInput.onclick = () => {
    library.libraryNameField.style.display = "none";
    library.initLibraryBt.classList.add("disabled");
}
/* Init Library Button */
library.initBt.onclick = () => {
    if (library.initBt.getAttribute("data-show") === "show") {
        library.initBt.setAttribute("data-show", "hide");
        library.initModal.style.display = "none";
        library.initIcon.className = "fa-solid fa-swatchbook";
        library.libraryIDField.style.display = "block";
        library.libraryNameField.style.display = "block";
        library.libraryNameField.classList.remove("mb-2");
        library.joinLibraryBt.classList.remove("disabled");
        library.initLibraryBt.classList.remove("disabled");
    } else {
        library.initBt.setAttribute("data-show", "show");
        library.initModal.style.display = "block";
        setTimeout(() => {
            library.initIcon.className = "fa-solid fa-xmark";
        }, 1800);
    }
}
/* Create New Library Routine */
library.initLibraryBt.onclick = () => {
    if (library.libraryNameInput.value !== "") {
        const Name = library.libraryNameInput.value;
        //TODO: create Library DB
        //TODO: Check if Name Exits
        showHideSecondaryWindow("حدد مصادر بيانات المكتبة", `
            <!-- Excel -->
            <div class="form-check form-switch mt-1 border rounded" style="padding: 15px 10px 10px 10px ;">
                <input class="form-control-file" type="file" style="display:none" id="browse_excelFile" accept=".xls">
                <label class="form-check-label" for="flexSwitchCheckChecked">تحميل ملف بيانات مكتبتك (Excel)</label>
                <a class="fw-bold border rounded cursorBt me-4" href="#" id="browse_excelFileBt">
                    اختر ملف<i class="fa-solid fa-file-excel me-2"></i></a>
            </div>
            <!-- OCR -->
            <div class="form-check form-switch mt-1 border rounded" style="padding: 15px 10px 10px 10px ;">
                <label class="form-check-label" for="flexSwitchCheckChecked">أضف الكناب بالبحث عن الغلاف (OCR)</label>
                <a class="fw-bold border rounded cursorBt me-1" href="#" id="CoverOCR">
                    الكاميرا <i class="fa-solid fa-barcode me-2"></i></a>
            </div>
            <div class="form-check form-switch mt-1 border rounded" style="padding: 15px 10px 10px 10px ;text-align:center">
                <label class="form-check-label" for="flexSwitchCheckChecked">أضف الكناب يدوياً بالضغط على أضف كتاب بالأعلى</label>
            </div>
            `, "تم")
        library.initBt.click();
    } else {
        library.libraryNameInput.style.border = "solid red 1px";
        showHideSecondaryWindow("خطأ", "املاء هذا الحقل <u>(اسم المكتبة)</u> أولاٌ", "تم");
        setTimeout(() => {
            library.libraryNameInput.style.border = "";
        }, 3000);
    }
}
/* Join to Already Exist Library Routine */
library.joinLibraryBt.onclick = () => {
    if (library.libraryIDInput.value !== "") {
        //TODO: join to library
    } else {
        library.libraryIDInput.style.border = "solid red 1px";
        showHideSecondaryWindow("خطأ", "إملاء هذا الحقل <u>(الرَّقْم التعريفي)</u> أولاٌ", "تم");
    }
}
/* Library Info Bt */
library.LibraryInfoBt.onclick = () => {
    let div = `
        
    `;
    showHideSecondaryWindow("حول", div, "تم");
}
/* Book OCR Scan Bt */
library.OCRBt.onclick = () => {
    let div = `<video id="OCRScreen" autoplay></video>`;
    showHideSecondaryWindow("البحث عن الكتاب بالغلاف", div, "تم");
    enableCamera().then(() => {
    });
}
// LibraryExtensionsBt
library.ExtensionsBt.onclick = () => {
    //TODO: on load get already enabled buttons
    let div = `
         <!-- Hindawi -->
            <div class="form-check form-switch pt-2 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">مؤسسة هنداوي</label>
            </div>
            <!-- Shamela -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">المكتبة الشاملة </label>
            </div>
            <!-- Gutenberg -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">مكتبة جوتنبرج</label>
            </div>
            <!-- TelegramBot -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">قناة تليجرام (<u>يمكنك اضافة قنوات
                        مختلفة</u>)</label>
            </div>
            <!-- Amazon -->
            <div class="form-check form-switch mb-1 mt-1 me-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label" for="flexSwitchCheckChecked">كتب امازون <u>(في حالة تفعيل خيار
                        الشراء)</u></label>
            </div>
    `;
    showHideSecondaryWindow("تفعيل بعض الاضافات", div, "تم");
}