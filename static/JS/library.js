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
import indexedDB from "./indexedDB.js";

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
                                for (let i = 0; i < document.getElementsByClassName("bookItemPriceCurrency").length; i++) {
                                    document.getElementsByClassName("bookItemPriceCurrency")[i].innerText = Currency;
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
                                    return 0;//TODO: return based on Update
                                }).then((newUpdate) => {
                                    /***
                                     * Write Data To Local Database
                                     * */
                                    if (newUpdate && LibraryData !== null) {
                                        // TODO: Put needed Data Only
                                        indexedDB.setData('myLibrary', LibraryData).then(result => {
                                            console.log(result);
                                        }).catch(err => {
                                            console.error(err);
                                        });
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
    libraryParties([
        {
            id: 1,
            libraryId: "8ca33e51-4a1d-4831-952d-beac82779e00",
            name: "Emma Watson Filipe",
            visits: 23,
            cover: "https://ntvb.tmsimg.com/assets/assets/247026_v9_bc.jpg"
        },
        {
            id: 1,
            libraryId: "8ca33e51-4a1d-4831-952d-beac82779e00",
            name: "Elizabeth Olsen",
            visits: 43,
            cover: "data:image/jpeg;base64,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"
        },
        {
            id: 1,
            libraryId: "8ca33e51-4a1d-4831-952d-beac82779e00",
            name: "Salma Hayek",
            visits: 383,
            cover: "https://m.media-amazon.com/images/M/MV5BMzkyMTk2NzM2Ml5BMl5BanBnXkFtZTcwNDQ4MjYzMg@@._V1_.jpg"
        }
    ]);
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
    const ProgressBar = document.getElementById("ocrProgressBar");
    const exitButton = document.getElementById("SecondaryWindowHeader_close");
    // const loading = document.getElementById('loading');
    OCR(video, canvas, output, ProgressBar, exitButton);//TODO: Design Robust algorithm
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