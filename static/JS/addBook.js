import showHideSecondaryWindow from './SecondaryWindow.js'
import misc from "./misc.js";
/* Global Vars */
var Rating = 0;

addBookBt.onclick = () => {
    if (misc.ID != null) {
        const content = `
    <div class="container" style="width:700px">
        <div class="row">
        <!-- Right Side -->
            <div class="col-4 p-3" style="width: 220px">
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
                    <a class="btn border rounded m-2 mt-0" style="color: var(--App-navTextColor);display:block" href="#"
                        id="download_cover">تحميل الغلاف<i class="fa-solid fa-cloud-arrow-down me-2"></i>
                    </a>
                </div>
            </div>

        <!-- Main Section -->
            <div class="mainSide col-8 rounded p-3 mt-3 pt-4" 
                style="background-color: var(--App-footerBgColor);display: block;height: 100%;">
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
                            <div class="container border rounded pt-2"
                                style="background-color: var(--App-panelBgColor);">
                                <form>
                                    <div class="form-group fw-bold">
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
    `;
        showHideSecondaryWindow("اضف كتاب", content, "اضف الكتاب");
        let browse_coverBt = document.getElementById("browse_cover");
        let download_coverBt = document.getElementById("download_cover");
        let browse_cover = document.getElementById("browse_cover_input");
        let bookCoverImg = document.getElementById("bookCover");
        let BookName = document.getElementById("BookName");
        let BookAuthor = document.getElementById("BookAuthor");
        let BookPC = document.getElementById("BookPagesCount");
        let BookPubDate = document.getElementById("BookPubDate");
        let BookPublisher = document.getElementById("BookPublisher");
        let bookAbout = document.getElementById("bookAbout");
        let ratingBts = document.getElementsByClassName("ratingBt");
        let alertPlaceholder = document.getElementsByClassName("alertPlaceholder");
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();  // Prevent the form from submitting
                showHideSecondaryWindow();
            }
        });

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
        // Cover Download Button
        download_coverBt.onclick = () => {
            if (BookName.value != "") {
                //TODO: Retrieve Cover by name
            } else {
                BookName.style.border = "solid 1px red";
                BookName.placeholder = "اكتب اسم الكتاب اولاً ليتم البحث"
                setTimeout(() => {
                    BookName.style.border = "";
                    BookName.placeholder = "اسم الكتاب"
                }, 3000);
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
        }
    }
}