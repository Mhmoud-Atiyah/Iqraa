import showHideSecondaryWindow from './SecondaryWindow.js'
import misc from "./misc.js";
import indexedDB from "./indexedDB.js";

/* Global Vars */
var Rating = 0;
const libraryId = localStorage.getItem('libraryId') || null;
// Redirect to Main View if Book not Found
let libraryRedirected = false,
    libraryMain = '',
    addBookWindowLibrary,
    addBookWindow;
indexedDB.getData('myLibrary', libraryId).then(libraryData => {
    libraryMain = libraryData['main'];
}).catch(err => {
    console.error(err);
});
/***
 * Library Add Book Initialization
 * */
if (window.location.href.includes('library')) {
    addBookWindowLibrary = `
    <div class="addbookWindow">
        <div class="container pb-3" style="width:700px">
        <div class="row">
            <!-- Right Side -->
            <div class="col-4 rounded p-3 mt-2 ms-2 pt-4" style="width: 220px;border: solid 1px var(--App-panelBorderColor)">
                <!-- Book Preview -->
                <img src="assets/bookCover.jpg" height="180px" width="180px" id="bookCover" style="filter: grayscale(100%)">
                <!-- Book Cover Buttons -->
                <div class="rounded fw-bold cursorBt" id="browse_preview" title="صور معاينة حالة الكتاب">
                    اختر ملف<i class="fa-solid fa-file-import me-2"></i>
                    <input class="form-control" type="file" multiple style="display:none" id="browse_preview_input" accept=".png,.jpg">
                </div>
            </div>
            <!-- Main Section -->
            <div class="mainSide col-8 rounded p-3 mt-2 pt-4" 
                style="border: solid 2px var(--App-panelBorderColor);display: block;height: 100%;">
                <!-- Book Name -->
                <div class="container mb-1">
                    <div class="row align-items-start">
                        <div class="col">
                            <input type="text" class="form-control required" id="BookName" placeholder="اسم الكتاب">
                        </div>
                    </div>
                </div>
                <!-- Library Name and Price -->
                <div class="container mb-1">
                    <div class="row align-items-start">
                        <div class="col">
                            <input type="text" class="form-control" id="BookPublisher" placeholder="دار النشر">
                        </div>
                        <div class="col col-3">
                            <input type="number" min="1" maxlength="4" step="1"
                                class="form-control required" id="addbookPrice" placeholder="السعر" data-toggle="tooltip"
                                data-placement="bottom" title="اكتب قيمة الكتاب (رقم)" style="font-family: NumberFont;">
                        </div>
                    </div>
                </div>
                <!-- Type and Section -->
                <div class="container mb-2">
                    <div class="row align-items-start">
                        <div class="col">
                        <select class="form-select" id="addBookType" style="cursor:pointer;color: var(--App-placeholderColor)" onclick="this.style.color = 'var(--App-textColor)';">
                                <option value="0" hidden>طبيعة الكتاب</option>
                                <option value="digital">رقمي</option>
                                <option value="hardcover">ورقي</option>
                            </select>                        
                        </div>
                        <div class="col">
                            <input type="text" class="form-control" id="addbookSection" placeholder="التصنيف (رواية, خيالي..)" data-toggle="tooltip"
                                data-placement="bottom" title="اكتب نوع الكتاب" style="font-family: NumberFont;">
                        </div>
                    </div>
                </div>
                <!-- purchase Options -->
                <div class="container fw-bold" style="font-family: Omar, serif;padding-right: 14px;color: var(--App-placeholderColor);user-select: none">
                    <div class="row align-items-start">
                        <div class="col">
                            <div class="form-check form-switch" onclick="this.firstElementChild.checked ? this.style.color = 'var(--App-textColor)' : this.style.color = 'var(--App-placeholderColor)'">
                                <input class="form-check-input mt-2 addBookOption" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">متاح للبيع</label>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-check form-switch" onclick="this.firstElementChild.checked ? this.style.color = 'var(--App-textColor)' : this.style.color = 'var(--App-placeholderColor)'">
                                <input class="form-check-input mt-2 addBookOption" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">متاح للقراءة</label>
                            </div>
                        </div>                        
                        <div class="col">
                            <div class="form-check form-switch" onclick="this.firstElementChild.checked ? this.style.color = 'var(--App-textColor)' : this.style.color = 'var(--App-placeholderColor)'">
                                <input class="form-check-input mt-2 addBookOption" type="checkbox" id="flexSwitchCheckChecked">
                                <label class="form-check-label" for="flexSwitchCheckChecked">متاح مجاناً</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
        <div id="alertPlaceholder"></div>
    </div>
    <div class="loader addbookLoader" style="display: none;position: absolute;left: 45%;top: 45%;"></div>
    `;
}
/***
 * Add Book Initialization
 * */
else {
    addBookWindow = `
    <div>
        <div class="container pb-3" style="width:700px">
            <div class="row">
        <!-- Right Side -->
            <div class="col-4 rounded p-3 mt-3 ms-2 pt-4" style="width: 220px;border: solid 1px var(--App-panelBorderColor)">
                <!-- Book Cover -->
                <img src="assets/bookCover.jpg" height="180px" width="180px" id="bookCover" style="filter: grayscale(100%)">
                <!-- Book Cover Buttons -->
                <div class="rightSideButtons" style="background-color: var(--App-panelBgColor);
                position: relative;top: -4px;
                width: 180px;border-end-start-radius: 7px;border-end-end-radius: 7px;border: solid 1px var(--App-panelBorderColor);">
                    <a class="btn border rounded m-2" style="color: var(--App-navTextColor);display:block" href="#"
                        id="browse_cover">اختر ملف<i class="fa-solid fa-file-import me-2"></i>
                        <input class="form-control" type="file" style="display:none" id="browse_cover_input" accept=".png,.jpg">
                    </a>
                </div>
            </div>
        <!-- Main Section -->
            <div class="mainSide col-8 rounded p-3 mt-3 pt-4" 
                style="border: solid 2px var(--App-panelBorderColor);display: block;height: 100%;">
                <!-- Book Name -->
                <div class="container">
                    <div class="row align-items-start">
                        <div class="mb-3 col">
                            <input type="text" class="form-control required" id="BookName" placeholder="اسم الكتاب">
                        </div>
                    </div>
                </div>
                <!-- Author Name -->
                <div class="container">
                    <div class="row align-items-start">
                        <div class="mb-3 col">
                            <input type="text" class="form-control required" id="BookAuthor" placeholder="اسم المؤلف">
                        </div>
                                                <div class="col col-4">
                            <input type="number" class="form-control required" id="BookPagesCount" max="9999"
                                placeholder="عدد الصفحات" data-toggle="tooltip" data-placement="bottom"
                                style="font-family: NumberFont;font-size: 16px;">
                        </div>

                    </div>
                </div>
                <!-- PG_Count , Pub_Date and Rating -->
                <div class="container">
                    <div class="row align-items-start mb-3 ">
                    <div class="mb-3 col">
                        <input type="text" class="form-control" id="BookPublisher" placeholder="دار النشر">
                    </div>
                        <div class="col col-3">
                            <input type="number" min="1800" max="2025" maxlength="4" step="1"
                                class="form-control required" id="BookPubDate" placeholder="سنة النشر" data-toggle="tooltip"
                                data-placement="bottom" title="سنة بين 1800 و 2025" style="font-family: NumberFont;">
                        </div>
                        <div class="col col-4">
                            <div class="container rounded pt-2 ps-2 pe-2"
                                style="background-color: var(--App-inputBgColor);border: solid 1px var(--App-inputBorderColor);color: var(--App-placeholderColor)">
                                <form>
                                    <div class="form-group">
                                        <div class="rating">
                                            <input type="radio" class="ratingBt" name="rating" id="star5"
                                                value="5"><label for="star5">&#9733;</label>
                                            <input type="radio" class="ratingBt" name="rating" id="star4"
                                                value="4"><label for="star4">&#9733;</label>
                                            <input type="radio" class="ratingBt" name="rating" id="star3"
                                                value="3"><label for="star3">&#9733;</label>
                                            <input type="radio" class="ratingBt" name="rating" id="star2"
                                                value="2"><label for="star2">&#9733;</label>
                                            <input type="radio" class="ratingBt" name="rating" id="star1"
                                                value="1"><label for="star1">&#9733;</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- About Book -->
                <div class="container">
                    <div class="row align-items-start">
                        <div class="col">
                            <textarea id="bookAbout" class="form-control required" rows="2" placeholder="عن الكتاب" style="font-size: 16px;"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div id="alertPlaceholder"></div>
    </div>
    <div class="loader" style="display: none;position: absolute;left: 45%;top: 45%;"></div>
    `;
}
/***
 * Listener
 * */
addBookBt.onclick = () => {
    if (misc.ID != null) {
        const SecondaryWindowBt = document.getElementById("SecondaryWindowBt_");
        /***
         * Library View
         * */
        if (window.location.href.includes('library') && !libraryRedirected) {
            showHideSecondaryWindow("اضف كتاب إلى مكتبتك", addBookWindowLibrary, "اضف الكتاب");
            const browse_previewBt = document.getElementById("browse_preview");
            const browse_preview = document.getElementById("browse_preview_input");
            const bookCoverImg = document.getElementById("bookCover");
            const BookName = document.getElementById("BookName");
            const BookPublisher = document.getElementById("BookPublisher");
            const BookPrice = document.getElementById("addbookPrice");
            const BookType = document.getElementById("addBookType");
            const BookSection = document.getElementById("addbookSection");
            const BookOptions = document.getElementsByClassName("addBookOption");
            const alertPlaceholder = document.getElementById("alertPlaceholder");
            // Cover Browse Button
            browse_previewBt.onclick = () => {
                browse_preview.click();
            }
            browse_preview.oninput = () => {
                if (browse_preview.value != "") {
                    const File = browse_preview.files[0].path;
                    bookCoverImg.src = File;
                    bookCoverImg.style.filter = "";
                }
            }
            /***
             * Check Required Fileds
             * */
            SecondaryWindowBt.onclick = () => {
                /****
                 * Fill Fileds First
                 * */
                if (BookName.value === "" || BookPrice.value === "") {
                    let requiredElements = document.getElementsByClassName("required");
                    for (let index = 0; index < requiredElements.length; index++) {
                        if (requiredElements[index].value === "") {
                            requiredElements[index].style.border = "solid 1px var(--App-redColor)";
                        }
                    }
                    alertPlaceholder.style.display = 'block';
                    alertPlaceholder.innerHTML = `<div class="addbookAlert w-50 float-start p-2 rounded-2">املاء البيانات المطلوبة أولا</div>`;
                    setTimeout(() => {
                        for (let index = 0; index < requiredElements.length; index++) {
                            if (requiredElements[index].value === "") {
                                requiredElements[index].style.border = "";
                            }
                        }
                        alertPlaceholder.style.display = 'none';
                    }, 3000);
                }
                /***
                 * Post Data To DB
                 * */
                else {
                    // Load Effect
                    document.getElementsByClassName('addbookLoader')[0].style.display = 'block';
                    document.getElementsByClassName('addbookWindow')[0].style.filter = 'blur(8px)';
                    misc.postForm(`addBook`, {
                        userId: misc.ID,
                        hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                        libraryId: libraryMain, // Where to put Data
                        bookName: BookName.value,
                        publisher: BookPublisher.value || null,
                        price: BookPrice.value,
                        type: BookType.value || "hardcover",
                        section: BookSection.value || null,
                        Paid: BookOptions[2].checked,
                        read: BookOptions[1].checked,
                        sell: BookOptions[0].checked
                    }, document.getElementById("browse_preview_input").files[0]).then((res) => {
                        /***
                         * Success
                         * */
                        if (!res.status) {
                            document.getElementsByClassName('addbookWindow')[0].innerHTML = "تم تحميل الكتاب بنجاح !";
                            window.location.reload();
                        }
                        /***
                         * Error !
                         * */
                        else {
                            /*TODO: Ack User */
                            console.log(res.msg);
                            libraryRedirected = true;
                        }
                        showHideSecondaryWindow();
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                }
            };
        }
        /***
         * Main View
         * */
        else {
            showHideSecondaryWindow("اضف كتاب", addBookWindow, "اضف الكتاب");
            const browse_coverBt = document.getElementById("browse_cover");
            const browse_cover = document.getElementById("browse_cover_input");
            const bookCoverImg = document.getElementById("bookCover");
            const BookName = document.getElementById("BookName");
            const BookAuthor = document.getElementById("BookAuthor");
            const BookPC = document.getElementById("BookPagesCount");
            const BookPubDate = document.getElementById("BookPubDate");
            const BookPublisher = document.getElementById("BookPublisher");
            const bookAbout = document.getElementById("bookAbout");
            const ratingBts = document.getElementsByClassName("ratingBt");
            const alertPlaceholder = document.getElementsByClassName("alertPlaceholder");
            // Cover Browse Button
            browse_coverBt.onclick = () => {
                browse_cover.click();
            }
            browse_cover.oninput = () => {
                if (browse_cover.value != "") {
                    bookCoverImg.src = browse_cover.files[0].path;
                    bookCoverImg.style.filter = "";
                }
            }
            // bookPageCount Button
            BookPC.oninput = () => {
                if (BookPC.value.length > 4) {
                    BookPC.style.border = "solid 1px red";
                    setTimeout(() => {
                        BookPC.style.border = "";
                    }, 2000);
                }
                ;
            }
            // PubDate Button
            BookPubDate.oninput = () => {
                if (BookPubDate.value.length > 4 ||
                    BookPubDate.value > 2025) {
                    BookPubDate.style.border = "solid 1px red";
                    setTimeout(() => {
                        BookPubDate.style.border = "";
                    }, 2000);
                }
                ;
            }
            // Rating Buttons
            for (let index = 0; index < ratingBts.length; index++) {
                ratingBts[index].onclick = () => {
                    Rating = 5 - index;
                }
            }
            // addBookBt
            SecondaryWindowBt.onclick = () => {
                if (BookName.value === "" ||
                    BookAuthor.value === "" ||
                    BookPC.value === "" ||
                    BookPC.value.length > 4 ||
                    BookPubDate.value === "" ||
                    BookPublisher.value === "" ||
                    BookPubDate.value.length > 4 ||
                    bookAbout.value === ""
                ) {
                    let requiredElements = document.getElementsByClassName("required");
                    for (let index = 0; index < requiredElements.length; index++) {
                        if (requiredElements[index].value === "") {
                            requiredElements[index].style.border = "solid 1px red";
                        }
                        ;
                    }
                    setTimeout(() => {
                        for (let index = 0; index < requiredElements.length; index++) {
                            if (requiredElements[index].value === "") {
                                requiredElements[index].style.border = "";
                            }
                            ;
                        }
                    }, 3000);
                    return;
                } else {
                    /* Check Cover Exist ? */
                    if (bookCoverImg.src != "") {
                        bookCoverImg.src = "assets/bookCover.jpg"
                    }
                    ;
                    // POST data to Server
                    postData(`addbook`, {
                        bookCover: browse_cover.files[0].path,
                        bookName: BookName.value,
                        bookAuthor: BookAuthor.value,
                        bookPC: BookPC.value,
                        bookPubDate: BookPubDate.value,
                        bookPublisher: BookPublisher.value,
                        bookRating: Rating,
                        bookAbout: bookAbout.value
                    }).then(() => {
                        showHideSecondaryWindow();
                    }).catch(error => {
                        console.error('Error:', error);
                    });
                }
            };
            libraryRedirected = false;
        }
        // Close Window on ESC
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();  // Prevent the form from submitting
                showHideSecondaryWindow();
            }
        });
    }
}