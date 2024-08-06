const ID = getQueryParams().userId; // get ID of User Open The Window

function createLibraryBook(BookData) {
    return `
         <div class="col bookItem rounded openBookBt" data-id="${BookData.id}">
                    <img class="bookCover cursorBt" src="${BookData.src}"
                        alt="${BookData.title}" srcset="" title="${BookData.title}">
                    <span class="bookItemData">
                        <p class="bookItemTitle cursorBt">${BookData.title}</p>
                        <p class="bookItemAuthor cursorBt">${BookData.author}</p>
                    </span>
                    <span class="bookItemPrice">
                        <span class="bookItemPriceText">${BookData.price}
                            <span class="bookItemPriceTextCurrency">${BookData.currency}</span>
                        </span>
                        <span class="bookItemPriceBt rounded cursorBt"><i class="fa-solid fa-cart-shopping"></i></span>
                    </span>
                </div>
    `;
};

function createLibrarySection(SectionTitle, Data) {
    let element =
        `
        <div class="row rowTitle fs-5 cursorBt">
            <div class="col">
                    ${SectionTitle}
                    <i class="fa-solid fa-angle-left me-2"></i>
            </div>
        </div>
        <div class="row">
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        </div>
        `;
    let Div = document.createElement('div');
    Div.className = "container rounded containerBook";
    Div.innerHTML = element;
    mainView.append(Div);
}

function mainModalLoad(title, body, bt) {
    library.MM_HeaderTitle.innerText = title;
    library.MM_Body.innerHTML = body;
    library.MM_Bt.innerText = bt;
};

function showHideMainModal() {
    if (library.mainModal.getAttribute("data-show") === "show") {
        library.mainModal.setAttribute("data-show", "hide");
        library.mainModal.style.display = "none";
    } else {
        library.mainModal.setAttribute("data-show", "show");
        library.mainModal.style.display = "block";
    }
};

library.MM_Bt.onclick = () => {
    showHideMainModal();
}
// Main Routine On start
window.onload = () => {
    getData(`loadConfig/${ID}`).then((config) => { // Global Config not User Config
        /* Dark mode setting */
        if (config.thememode === "dark") { // Now is Dark
            loadTheme("darkTheme");
        } else {    // Now is Light
            loadTheme("lightTheme");
        }
        // Current User Data
        if (config.newlibrary) { // First look Library
            let element =
                `
                <div class="newSection position-relative overflow-hidden m-md-2 text-center rounded p-4" style="border: solid 1px var(--App-panelBorderColor);font-family: Moharram, serif">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: DecorationFont2;"> وأرضك من حلي التاريخ رق<br> سماؤك من حلى الماضي كتاب</h1>
                        <h1 class="display-4 fw-normal">ما زالت المكتبة <span class="text-danger">فارغة</span></h1>
                        <p class="lead fw-normal fs-3">يمكنك إستخدام المكتبة كفرد أو مؤسسة<br></p>
                        <p class="lead fw-normal fs-3">فقط اضغط على الزر بالأسفل لتكوين مكتبتك<br>
                     كما يمكنك  الإنضام الى مكتبة من خلال رقمها التعريفي</p>
                    </div>
                </div>
            `;
            let Div = document.createElement('div');
            Div.id = "mainChild";
            Div.innerHTML = element;
            mainView.append(Div);
        };
        accountBt.innerText = config.fname + " " + config.lname;
        profileBt.src = config.profile;
        profileBt.alt = config.account;
    })
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
    library.initModal.style.display = "none";
    library.mainModal.style.display = "none";
    library.initBt.setAttribute("data-show", "hide");
    library.LibraryInfoBt.setAttribute("data-show", "hide");
    // mainModalLoad("تحذير","<i>text</i>","تمام")

    // createLibrarySection("الكتب العربية الأكثر مبيعًا", [
    //     {
    //         id: 2026227766,
    //         src: "https://www.shoroukbookstores.com/images/Books/thumb/9789770937570.jpg",
    //         title: "علاقات خطيرة",
    //         author: "محمد طه",
    //         price: "134",
    //         currency: "د.ق"
    //     }
    // ]);
    // //---------------------------------------------------------
    // // Global Event Listener
    // //---------------------------------------------------------
    // /* Open Book */
    // for (let index = 0; index < openBookBt.length; index++) {
    //     openBookBt[index].onclick = () => {
    //         window.IPC.openBookWindow(openBookBt[index].getAttribute("data-id"),ID);
    //     }
    // }
}

addBookBt.onclick = () => { window.IPC.openAddBookWindow(); }

library.LibraryInfoBt.onclick = () => {
    if (library.LibraryInfoBt.getAttribute("data-show") === "show") {
        library.LibraryInfoBt.setAttribute("data-show", "hide");
        // library.initModal.style.display = "none";
    } else {
        library.LibraryInfoBt.setAttribute("data-show", "show");
        // library.initModal.style.display = "block";
    }
}
// Init Session Button
// TODO: on session going this button will red X button for Exit!
library.initBt.onclick = () => {
    if (library.initBt.getAttribute("data-show") === "show") {
        library.initBt.setAttribute("data-show", "hide");
        library.initModal.style.display = "none";
        library.initIcon.className = "fa-solid fa-swatchbook";
    } else {
        library.initBt.setAttribute("data-show", "show");
        library.initModal.style.display = "block";
        setTimeout(() => {
            library.initIcon.className = "fa-solid fa-xmark";
        }, 1800);
    }
}
//--------------------------------------//
//---- Main Initialization Routine -----//
//--------------------------------------//
library.IM_initLibraryBt.onclick = () => {
    if (library.IM_LibraryName.value != "") {
        const Name = library.IM_LibraryName.value;
        //TODO: create Library DB
        //TODO: Check if Name Exits
        showHideMainModal();
        mainModalLoad("حدد مصادر بيانات المكتبة", `
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
        library.IM_LibraryName.style.border = "solid red 1px";
        showHideMainModal();
        mainModalLoad("خطأ", "املاء هذا الحقل <u>(اسم المكتبة)</u> أولاٌ", "تم");
        setTimeout(() => {
            library.IM_LibraryName.style.border = "";
        }, 3000);
    }
}
library.IM_joinLibraryBt.onclick = () => {
    if (library.IM_LibraryName.value != "") {
        //TODO: join to library
    } else {
        library.IM_LibraryID.style.border = "solid red 1px";
        showHideMainModal();
        mainModalLoad("خطأ", "املاء هذا الحقل <u>(الرقم التعريفي)</u> أولاٌ", "تم");
    }
}

// Function to handle errors
function handleError(error) {
    console.error('Error accessing media devices: ', error);
}

// Function to start the camera
async function startCamera() {
    try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Create a video element to display the stream
        const videoElement = document.createElement('video');
        videoElement.className = "OCRScreen";
        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        videoElement.playsInline = true; // For mobile devices

        // Append the video element to the container
        library.MM_Body.appendChild(videoElement);
    } catch (err) {
        handleError(err);
    }
}

// LibraryInfoBt
library.LibraryInfoBt.onclick = () => {
    showHideMainModal();
    let div = `
        
    `;
    mainModalLoad("حول", div, "تم");
}
library.OCRBt.onclick = () => {
    startCamera();
    showHideMainModal();
    let div = `
        
    `;
    mainModalLoad("البحث عن الكتاب بالغلاف", div, "تم");
}
// LibraryExtensionsBt
library.ExtensionsBt.onclick = () => {
    //TODO: Complete this step
    //TODO: on load get already enabled buttons
    showHideMainModal();
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
    mainModalLoad("تفعيل بعض الاضافات", div, "تم");
}