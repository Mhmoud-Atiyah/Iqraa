const libraryId = misc.getQueryParams().libraryId || null;
// Global Variable hold Data
let LibraryData = {} || null;
// Components
import misc from './misc.js';
import showHideSecondaryWindow from './SecondaryWindow.js';
import initLibrary from '../components/initLibrary.js';
import createLibrarySection from '../components/librarySection.js';
import addLibraryButton from "../components/libraryButton.js";
import libraryAbout from "../components/libraryAbout.js";
import libraryParties from "../components/libraryParties.js";
import libraryExtensions from "../components/libraryExtensions.js";
import libraryResource from "../components/libraryResource.js";
import ocrScreen from "../components/ocrScreen.js";
import OCR from "./ocr.js";

/***********************
 * Main Routine On start
 * ********************/
window.onload = () => {
    library.initModal.style.display = "none";
    library.initBt.setAttribute("data-show", "hide");
    /******************
     * Get Window Ready
     ******************/
    misc.getData(`loadConfig/${misc.ID}`).then((config) => {
            /*************
             * Load Library
             * ***********/
            if (!config.newlibrary) {
                library.libraryNameField.remove();
                library.initLibraryBt.remove();
                /********************
                 * load Other's Library
                 * ******************/
                if (libraryId != null && config.mylibrary !== libraryId) {
                    // TODO: Just request the update by comparing Flag
                    //  (Update: 1323) of Library Data with current one local on IndexDb
                    misc.postData('loadLibrary', { // Get Authorized
                        userId: misc.ID,
                        libraryId: libraryId,
                        hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                    }).then(res => {
                        // Success (Party)
                        if (!res.status) {
                            const otherLibraryData = res.msg;
                            LibraryData = otherLibraryData;// set Global LibraryData
                            profileBt.style.border = "solid 2px var(--App-linkHoverColor)";// Enable User Mode
                            misc.getData(`loadLibrarySection/${otherLibraryData.main}`).then(sectionDataBooks => {
                                createLibrarySection(`${otherLibraryData.title}`, sectionDataBooks);
                                /*****************
                                 * 1. Set Currency
                                 * ***************/
                                const Currency = misc.currency[otherLibraryData.currency];
                                for (let i = 0; i < document.getElementsByClassName("bookItemPriceTextCurrency").length; i++) {
                                    document.getElementsByClassName("bookItemPriceTextCurrency")[i].innerText = Currency;
                                }
                            }).catch(err => {
                                console.error(`error occurred ${err}`)
                            })
                        }
                        // Fail (Private Library)
                        else {
                            showHideSecondaryWindow("خطأ", `
                            غير مسموح لك بالتواجد في هذه المكتبة أو مشاهدة محتوياتها<br>
                            <p style="color: var(--App-highlightColor);text-align: center;margin-top: 10px;">(يمكنك طلب الانضمام)</p>
                        `, "إعادة توجيه");
                            console.error(`Error: ${res.msg}`);
                            document.getElementById("SecondaryWindowBt_").onclick = () => {
                                window.location.href = window.location.href.split("library")[0] + "library";
                            }
                        }
                    }).then(() => {
                        /*************************
                         * Activate library button
                         * ***********************/
                        for (let i = 0; i < document.getElementsByClassName("headerCenterBt").length; i++) {
                            const id = document.getElementsByClassName("headerCenterBt")[i].getAttribute("data-libraryId");
                            if (libraryId === id) {
                                document.getElementsByClassName("headerCenterBt")[i].style.color = "var(--App-buttonTextColor)";
                                document.getElementsByClassName("headerCenterBt")[i].style.backgroundColor = "var(--App-buttonBgColor)";
                            }
                        }
                    });
                }
                /****************
                 * Load my Library
                 * **************/
                else {
                    if (config.mylibrary != null) {
                        // TODO: Library Data local on IndexDb with Just Push Updates
                        //  and load Once First Time
                        misc.postData('loadLibrary', { // Get Authorized
                            userId: misc.ID,
                            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                            libraryId: config.mylibrary
                        }).then(res => {
                            // Success
                            if (!res.status) {
                                // set Global LibraryData
                                LibraryData = res.msg;
                                // Enable Admin Mode
                                profileBt.style.border = "solid 2px var(--App-redColor)";
                                /*******************
                                 * Load Library View
                                 * *****************/
                                misc.getData(`loadLibrarySection/${LibraryData.main}`).then(DataBooks => {
                                    createLibrarySection(`مكتبتي`, DataBooks);
                                    // 1. Set Currency
                                    const Currency = misc.currency[LibraryData.currency];
                                    for (let i = 0; i < document.getElementsByClassName("bookItemPriceTextCurrency").length; i++) {
                                        document.getElementsByClassName("bookItemPriceTextCurrency")[i].innerText = Currency;
                                    }
                                }).catch(err => {
                                    console.error(`error occurred ${err}`)
                                })
                            }
                            // Fail
                            else {
                                console.error(`Error: ${res.msg}`);
                            }
                        });
                    }
                }
                /*****************************
                 * Libraries Top Buttons
                 * ***************************/
                if (config.libraries != null && config.libraries.length > 0) {
                    // TODO: remove this since here is a lot of requests
                    for (let i = 0; i < config.libraries.length; i++) {
                        const libraryId = config.libraries[i];
                        misc.postData('loadLibraries', { // Get Authorized
                            userId: misc.ID,
                            libraryId: libraryId,
                            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                        }).then(libraryData => {
                            addLibraryButton(libraryData);
                        });
                    }
                }
            }
            /****************
             * Welcome Message
             * **************/
            else {
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
                library.initBt.classList.add("pulsed-border");
            }
            /***
             * Load Libraries buttons
             * */

            /****************
             * Responsive View
             * **************/
            const headerCenterSpace = document.body.offsetWidth - document.getElementById("headerRight").offsetWidth - searchInput.offsetWidth - addBookBt.offsetWidth - 80;
            document.getElementById("headerCenter").style.right = document.getElementById("headerRight").offsetWidth + 40 + 'px';
            document.getElementById("headerCenter").style.width = headerCenterSpace + 'px';
            /*****
             * Load Effect
             * ****/
            document.getElementsByClassName('loader')[0].remove();
            mainView.style.filter = "blur(0)";
        }
    )
};
/****************
 * Library Info Bt
 * ***************/
library.LibraryInfoBt.onclick = () => {
    showHideSecondaryWindow("بطاقة التعريف", libraryAbout(LibraryData), "تمام");
}
/****************
 * Parties Button
 * **************/
library.PartiesBt.onclick = () => {
    // TODO: you have two choices 1. for each id get data or from pg create routine to get data
    libraryParties({
        id: 1,
        libraryId: "8ca33e51-4a1d-4831-952d-beac82779e00",
        name: "Emma Watson Filipe",
        visits: 23,
        cover: "https://ntvb.tmsimg.com/assets/assets/247026_v9_bc.jpg"
    });
}
/********************
 * LibraryExtensionsBt
 * *********************/
library.ExtensionsBt.onclick = () => {
    // TODO: add extension for library which print book on demand !
    libraryExtensions();
}
/*********************
 * Book OCR Scan Bt
 * ********************/
const OCRScreen = ocrScreen();
library.OCRBt.onclick = () => {
    showHideSecondaryWindow("البحث عن الكتاب بالغلاف", OCRScreen, "إضافة");
    const video = document.getElementById('OCRScreen');
    const canvas = document.getElementById('canvas');
    const output = document.getElementById('recognizedText');
    const exitButton = document.getElementById("SecondaryWindowHeader_close");
    // const loading = document.getElementById('loading');
    OCR(video, canvas, output, exitButton);//TODO: Design Robust algorithm
    //TODO: disable the add button until ocr give good value
}
/***************
 * Admin Mode Bt
 **************/
library.AdminModeBt.onclick = () => {
    /***
     * Admin Mode
     * */
    if (LibraryData.adminid != null && LibraryData.hash != null && LibraryData.main != null) {
        // User is Admin
        libraryResource(LibraryData.main);
    }
    /***
     * User mode
     * */
    else {
        showHideSecondaryWindow("مصادر المكتبة", `<p class="pb-1 pt-1" style="font-family: Monadi, serif">لا يمكنك تحديد مصادر هذه المكتبة !<br></p>`, "تمام");
    }
}
/**********
 * Misc Theme
 * *******/
library.libraryNameInput.onclick = () => {
    library.libraryNameField.classList.add("mb-2");
    library.libraryIDField.style.display = "none";
    library.joinLibraryBt.classList.add("disabled");
}
library.libraryIDInput.onclick = () => {
    library.libraryNameField.style.display = "none";
    library.initLibraryBt.classList.add("disabled");
}
/*********************
 * Init Library Button
 * ********************/
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
        library.initBt.classList.remove("pulsed-border");
        setTimeout(() => {
            library.initIcon.className = "fa-solid fa-xmark";
        }, 1800);
    }
}
/***************************
 * Create New Library Routine
 ***************************/
library.initLibraryBt.onclick = () => {
    /***************
     * Creation Window
     * *************/
    if (library.libraryNameInput.value !== "") {
        const libraryName = library.libraryNameInput.value;
        /*TODO: if (libraryId === null) { // Library Not Exist*/
        if (true) { // Library Not Exist
            initLibrary(libraryName);
        }
        library.initBt.click();
        library.initBt.classList.add("disabled")
    }
    /*******
     * Error !
     * *****/
    else {
        library.libraryNameInput.style.border = "solid #b3261eff 1px";
        showHideSecondaryWindow("خطأ", "<p style='font-family: Monadi, serif' class='pb-1 pt-1'>املأ هذا الحقل <u>(اسم المكتبة)</u> أولاٌ</p>", "تم");
        setTimeout(() => {
            showHideSecondaryWindow();
            library.libraryNameInput.style.border = "";
        }, 3000);
    }
}
/***********************
 * Join to Library Routine
 ***********************/
library.joinLibraryBt.onclick = () => {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    // check id first
    if (library.libraryIDInput.value !== "" && regex.test(library.libraryIDInput.value) /*&& library.libraryIDInput.value !== libraryId*/) {
        misc.postData('joinLibrary', { // Get Authorized
            userId: misc.ID,
            libraryId: library.libraryIDInput.value || null,
            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
        }).then(res => {
            if (typeof res === "object") {
                if (!res.status) {// User Added to Library
                    showHideSecondaryWindow("إتمام الانضمام", `
                            تمت عملية الانضمام بنجاح !<br>
                            <p style="color: var(--App-highlightColor);text-align: center;margin-top: 10px;">(اضغط اعادة التوجيه)</p>
                        `, "إعادة توجيه");
                    console.log(res.msg);
                    document.getElementById("SecondaryWindowBt_").onclick = () => {
                        window.location.href = window.location.href.split("library")[0] + "library?libraryId=" + library.libraryIDInput.value + "&userId=" + misc.ID;
                    }
                } else {
                    showHideSecondaryWindow("خطأ", `
                            تم إرسال طلب انضمام إلى مدير المكتبة وسيتم الرد عليك قريباً<br>
                            <p style="color: var(--App-highlightColor);text-align: center;margin-top: 10px;">(يمكنك طلب الانضمام)</p>
                        `, "تم");
                    console.log(res.msg);
                    document.getElementById("SecondaryWindowBt_").onclick = () => {
                        showHideSecondaryWindow();
                        library.initBt.click();
                        library.libraryIDInput.value = "";
                    }
                }
            }
        })
    } else {
        library.libraryIDInput.style.border = "solid #b3261eff 1px";
        showHideSecondaryWindow("خطأ", "<p style='font-family: Monadi, serif' class='pb-1 pt-1'>املأ هذا الحقل <u>(اسم المكتبة)</u> أولاٌ</p>", "تم");
        setTimeout(() => {
            showHideSecondaryWindow();
            library.libraryIDInput.style.border = "";
        }, 3000);
    }
}