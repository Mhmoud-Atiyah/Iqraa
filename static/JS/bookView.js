import misc from "./misc.js";
import showHideSecondaryWindow from "./SecondaryWindow.js";
import loadBookDataPage from "../components/loadBookDataPage.js";
import AddToMyBooks from "../components/addToMyBooks.js";
import userReview from "../components/userReview.js";
import confirmWindow from "../components/confirmWindow.js";
import loadAuthorPage from "../components/loadAuthorPage.js";
import List from "./List.js";

const BookID = misc.getQueryParams().bookId;
// TODO:==> path of book include link of reading (.kfx or epub or pdf)
window.onload = () => {
    /************
     * Mobile View
     * *********/
    if (window.innerWidth <= 480) {
        document.getElementById("book_view_cover").style.left = ((window.innerWidth - 170) / 2) + 'px';
    }
    /************
     * Iqraa User
     * **********/
    if (misc.ID !== undefined && misc.ID) {
        // Retrieve Data First
        misc.getData(`loadBookData/${misc.ID}/${BookID}`).then(bookData => {
            document.title = `كتاب ${bookData.title} للكاتب ${bookData.author.name}`
            loadBookDataPage(bookData);
            // TODO: Think about remove this request and save authors data to indexDb using worker
            /***
             * Author Pages
             * */
            if (Array.isArray(bookData.authorids)) {
                /***
                 * Create DLL
                 * */
                const list = new List();
                // Append Main Author
                list.append({
                    No: 1,
                    'المؤلف': bookData.authorid
                });
                list.setCurrent(list.head);
                // Append Other Authors/Translators
                for (let i = 0; i < bookData.authorids.length; i++) {
                    const author = bookData.authorids[i];
                    /***
                     * Translator
                     * */
                    if (Array.isArray(bookData.translator) && bookData.translator.includes(author)) {
                        list.append({
                            No: i + 2,
                            'المترجم': author
                        });
                    }
                    /***
                     * Another Author
                     * */
                    else {
                        list.append({
                            No: i + 2,
                            'المؤلف': author
                        });
                    }
                }
                let current = list.getCurrent();
                /***
                 * Previous Button
                 * */
                book_view.author_prev.onclick = () => {
                    book_view.authorPage.style.filter = "blur(12px)";
                    let preLoad = document.createElement("span");
                    preLoad.className = "loader";
                    preLoad.style.left = book_view.authorPage.offsetLeft + (book_view.authorPage.offsetWidth / 2) + 'px';
                    preLoad.style.top = book_view.authorPage.offsetTop + (book_view.authorPage.offsetHeight / 2) + 'px';
                    book_view.authorPageSpinner.append(preLoad);
                    misc.getData(`loadAuthorData/${Object.values(list.getPrev(current).value)[1]}`).then((res) => {
                            /***
                             * Success
                             * */
                            if (!res.status) {
                                current = current.prev;
                                const prev = list.getPrev(current),
                                    next = list.getNext(current);
                                const authorData = res.author;
                                loadAuthorPage(authorData, current.value['No'], Object.keys(current.value)[1]);
                            }
                            /***
                             * Fail
                             * */
                            else {
                                //TODO:
                            }
                            book_view.authorPage.style.filter = "blur(0px)";
                            book_view.authorPageSpinner.removeChild(book_view.authorPageSpinner.lastElementChild);
                        }
                    )
                }
                /***
                 * Next Button
                 * */
                book_view.author_next.onclick = () => {
                    book_view.authorPage.style.filter = "blur(12px)";
                    let preLoad = document.createElement("span");
                    preLoad.className = "loader";
                    preLoad.style.left = book_view.authorPage.offsetLeft + (book_view.authorPage.offsetWidth / 2) + 'px';
                    preLoad.style.top = book_view.authorPage.offsetTop + (book_view.authorPage.offsetHeight / 2) + 'px';
                    book_view.authorPageSpinner.append(preLoad);
                    misc.getData(`loadAuthorData/${Object.values(list.getNext(current).value)[1]}`).then((res) => {
                            /***
                             * Success
                             * */
                            if (!res.status) {
                                current = current.next;
                                const prev = list.getPrev(current),
                                    next = list.getNext(current);
                                const authorData = res.author;
                                loadAuthorPage(authorData, current.value['No'], Object.keys(current.value)[1]);
                            }
                            /***
                             * Fail
                             * */
                            else {
                                //TODO:
                            }
                            book_view.authorPage.style.filter = "blur(0px)";
                            book_view.authorPageSpinner.removeChild(book_view.authorPageSpinner.lastElementChild);
                        }
                    )
                }
            }
            /***
             * Suggestion
             * */
            if (Array.isArray(bookData.suggestions)) {
                // TODO: Add Load Effect
                misc.getData(`loadBooksDataMain/${bookData.suggestions}`).then((res) => {
                    /***
                     * Success
                     * */
                    if (!res.status) {
                        const Books = res.msg;
                        for (let i = 0; i < Books.length; i++) {
                            let Book = document.createElement('div');
                            Book.className = 'col-md-2';
                            Book.innerHTML = `<a href="bookview?bookId=${Books[i].id}">
                                    <img src="${Books[i].coversrc}"
                                         class="d-block rounded w-100" height="160px" alt="${Books[i].title}" title="${Books[i].title}">
                                </a>
                    `;
                            book_view.suggestionList.append(Book);
                        }
                    }
                    /***
                     * Fail
                     * */
                    else {
                        console.error(res.msg);
                    }
                })
            }
        }).then(() => {
            //TODO: check when two buttons are active
            // Add book to user's table (READ)
            book_view.readBt.onclick = () => {
                /**************
                 * Not Read Yet
                 * ************/
                if (book_view.readBt.getAttribute("data-active") !== "true") {
                    /*************
                     * Get User Tags
                     * *************/
                    if (misc.ID != null) {
                        //TODO: get User Tags from indexDb
                        misc.getData(`loadConfig/${misc.ID}`).then((config) => {
                            showHideSecondaryWindow("إضافة كتاب", AddToMyBooks(config.tags), "إضافة", 'normal');
                            /***
                             * Make Tags Buttons Toggle
                             * */
                            for (let i = 0; i < document.getElementsByClassName('bookshelfBt').length; i++) {
                                document.getElementsByClassName('bookshelfBt')[i].addEventListener('click', function () {
                                    this.classList.toggle('active');
                                    if (this.classList.contains('active')) {
                                        this.style.backgroundColor = 'var(--App-inputBgColor)';
                                        this.style.border = 'solid 2px var(--App-inputBorderColor)';
                                    } else {
                                        this.style.backgroundColor = 'transparent';
                                        this.style.border = 'solid 2px var(--App-panelBorderColor)';
                                    }
                                });
                            }
                            /***
                             * Make Rate Stars Interactive
                             * */
                            for (let i = 0; i < document.getElementsByClassName('ratingBt').length; i++) {
                                const rateBt = document.getElementsByClassName('ratingBt')[i];
                                const rateInfo = document.getElementsByClassName('info-box')[i];
                                // Activate Star
                                rateBt.addEventListener('click', function () {
                                    this.classList.toggle('active');
                                    if (this.classList.contains('active')) {
                                        this.style.color = 'var(--App-starsColor)';
                                    } else {
                                        this.style.color = 'var(--App-textColor)';
                                    }
                                });
                                // Show Info
                                rateBt.addEventListener('mouseover', function (event) {
                                    rateInfo.style.display = 'block';
                                    rateInfo.style.left = `${rateBt.style.offsetX + 10}px`; // Adjust x position
                                    rateInfo.style.top = `${rateBt.style.offsetY + 10}px`; // Adjust y position
                                });
                                // Hide Info
                                rateBt.addEventListener('mouseout', function () {
                                    rateInfo.style.display = 'none';
                                });
                            }
                            /***
                             * User Data
                             * */
                            let startDate,
                                endDate,
                                bookshelf = 'read',
                                review = '',
                                bookShelves = [],
                                rate = 0;
                            /*********
                             * Add Book
                             * *******/
                            document.getElementById("SecondaryWindowBt_").onclick = () => {
                                /**************
                                 * Validate Data
                                 * ************/
                                startDate = document.getElementById('addBookModal_dateRead_from').value || null;
                                endDate = document.getElementById('addBookModal_dateRead_to').value || null;
                                review = document.getElementById('myBookComment').value || null;
                                // Count Stars
                                for (let i = 0; i < document.getElementsByClassName('ratingBt').length; i++) {
                                    if (document.getElementsByClassName('ratingBt')[i].classList.contains('active'))
                                        rate++;
                                }
                                // Selected Tags
                                for (let i = 0; i < document.getElementsByClassName('bookshelfBt').length; i++) {
                                    if (document.getElementsByClassName('bookshelfBt')[i].classList.contains('active'))
                                        bookShelves.push(document.getElementsByClassName('bookshelfBt')[i].innerHTML);
                                }
                                // Close Add Window
                                document.getElementById("SecondaryWindowHeader_close").click();
                                /**********
                                 * Post Data
                                 *  *******/
                                misc.postData("addToMyBooks", {
                                    bookId: BookID,
                                    userId: misc.ID,
                                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                                    data: [startDate, endDate, bookshelf, review, bookShelves, rate]
                                }).then((res) => {
                                    /***
                                     * Success
                                     * */
                                    if (!res.status) {
                                        console.log(res.msg);
                                        showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
                                        book_view.readBt.setAttribute("data-active", "true");
                                        book_view.readBt.style.backgroundColor = "var(--App-panelBorderColor)";
                                    } else {
                                        console.error(res.msg);
                                    }
                                });
                            }
                        })
                    }
                }
                /*************
                 * Read Already
                 * ************/
                else {
                    setTimeout(() => {
                        showHideSecondaryWindow("تنبيه",
                            `<div class="container pt-2 pb-2" style='font-family: Monadi, serif'>
                                    <h1 class='fs-6 text-center'>هل تريد إزالة الكتاب من مكتبتك ؟</h1>
                                    <h1 class='fs-6 text-center'>(مسح التقييم والمراجعة وكافة البيانات المرتبطة بالكتاب)</h1>
                                  </div>`
                            , "حذف", 'warning');
                        /*********
                         * Remove Book
                         * *******/
                        document.getElementById("SecondaryWindowBt_").onclick = () => {
                            /**********
                             * Post Data
                             *  *******/
                            misc.postData('deleteFromMyBooks', {
                                userId: misc.ID,
                                hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                                bookId: BookID
                            }).then(res => {
                                /***
                                 * Success
                                 * */
                                if (!res.status) {
                                    book_view.readBt.style.backgroundColor = "transparent";
                                    book_view.readBt.setAttribute("data-active", "false");
                                    document.getElementById("SecondaryWindowHeader_close").click();
                                }
                                /***
                                 * Error !
                                 * */
                                else {
                                    /*TODO: Ack User */
                                    console.log(res.msg);
                                }
                            });
                        }
                    }, 100)
                }
            };
            // Add book to user's table (WANT)
            book_view.wantreadBt.onclick = () => {
                /**************
                 * Not Wanted Yet
                 * ************/
                if (book_view.wantreadBt.getAttribute("data-active") !== "true") {
                    // Neither Want Nor read
                    if (misc.ID != null && book_view.readBt.getAttribute("data-active") !== "true") {
                        setTimeout(() => {
                            showHideSecondaryWindow("تنبيه",
                                `<div class="container pt-2 pb-2" style='font-family: Monadi, serif'>
                                    <h1 class='fs-6 text-center'>هل تريد إضافة الكتاب إلى مكتبتك ؟</h1>
                                  </div>`
                                , "إضافة", 'normal');
                            document.getElementById("SecondaryWindowBt_").onclick = () => {
                                // Close Add Window
                                document.getElementById("SecondaryWindowHeader_close").click();
                                /**********
                                 * Post Data
                                 *  *******/
                                misc.postData("addToMyBooks", {
                                    bookId: BookID,
                                    userId: misc.ID,
                                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                                }).then((res) => {
                                    /***
                                     * Success
                                     * */
                                    if (!res.status) {
                                        console.log(res.msg);
                                        showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
                                        book_view.wantreadBt.setAttribute("data-active", "true");
                                        book_view.wantreadBt.style.backgroundColor = "var(--App-panelBorderColor)";
                                    } else {
                                        console.error(res.msg);
                                    }
                                });
                            }
                        }, 100)
                    }
                    // Read Already not Want
                    else {
                        setTimeout(() => {
                            showHideSecondaryWindow("تنبيه",
                                `<div class="container pt-2 pb-2" style='font-family: Monadi, serif'>
                                    <h1 class='fs-6 text-center'>لقد قرأت هذا الكتاب بالفعل</h1>
                                    <h1 class='fs-6 text-center'>هل تريد قرأت الكتاب مرة أخرى ؟</h1>
                                  </div>`
                                , "أريد", 'normal');
                            document.getElementById("SecondaryWindowBt_").onclick = () => {
                                // Close Add Window
                                document.getElementById("SecondaryWindowHeader_close").click();
                                /**********
                                 * Post Data
                                 *  *******/
                                misc.postData("addToMyBooks", {
                                    bookId: BookID,
                                    userId: misc.ID,
                                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                                }).then((res) => {
                                    /***
                                     * Success
                                     * */
                                    if (!res.status) {
                                        console.log(res.msg);
                                        showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
                                        book_view.readBt.setAttribute("data-active", "true");
                                        book_view.readBt.style.backgroundColor = "var(--App-panelBorderColor)";
                                    } else {
                                        console.error(res.msg);
                                    }
                                });
                            }
                        }, 100)
                    }
                }
                /*************
                 * Wanted Already
                 * ************/
                else {
                    setTimeout(() => {
                        showHideSecondaryWindow("تنبيه",
                            `<div class="container pt-2 pb-2" style='font-family: Monadi, serif'>
                                    <h1 class='fs-6 text-center'>هل تريد إزالة الكتاب من مكتبتك ؟</h1>
                                    <h1 class='fs-6 text-center'>(مسح التقييم والمراجعة وكافة البيانات المرتبطة بالكتاب)</h1>
                                  </div>`
                            , "حذف", 'warning');
                        document.getElementById("SecondaryWindowBt_").onclick = () => {
                            // Close Add Window
                            document.getElementById("SecondaryWindowHeader_close").click();
                            /**********
                             * Post Data
                             *  *******/
                            misc.postData('deleteFromMyBooks', {
                                userId: misc.ID,
                                hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                                bookId: BookID
                            }).then(res => {
                                /***
                                 * Success
                                 * */
                                if (!res.status) {
                                    book_view.wantreadBt.style.backgroundColor = "transparent";
                                    book_view.wantreadBt.setAttribute("data-active", "false");
                                    document.getElementById("SecondaryWindowHeader_close").click();
                                }
                                /***
                                 * Error !
                                 * */
                                else {
                                    /*TODO: Ack User */
                                    console.log(res.msg);
                                }
                            });
                        }
                    }, 100)
                }
            }
            // Currently read
            book_view.readNowBt.onclick = () => {
            }
            // purchase option
            book_view.purchaseBt.onclick = () => {

            }
        });
    }
    /**************
     * Internet User
     * ************/
    else {
        misc.getData(`loadBookData/${misc.ID}/${BookID}`).then(bookData => {
            document.title = `كتاب ${bookData.title} للكاتب ${bookData.author.name}`;
            loadBookDataPage(bookData);
        }).then(() => {
            confirmWindow(book_view.Modal, {
                title: "منصة أقراء",
                body: "لا يمكنك (زائر) التعديل ولكن يمكنك الانضمام إلى منصة أقراء للإستمتاع بكافة الخيارات المتاحة",
                btTrue: "الانضمام",
                btFalse: "الغاء"
            }, () => {
                window.location.href = "/signup"
            }, () => {
            });
            // Add book to user's table (READ)
            book_view.readBt.setAttribute('data-bs-toggle', 'modal');
            book_view.readBt.setAttribute('data-bs-target', '#confirmationModal');
            book_view.wantreadBt.setAttribute('data-bs-toggle', 'modal');
            book_view.wantreadBt.setAttribute('data-bs-target', '#confirmationModal');
            book_view.readNowBt.setAttribute('data-bs-toggle', 'modal');
            book_view.readNowBt.setAttribute('data-bs-target', '#confirmationModal');
            book_view.purchaseBt.setAttribute('data-bs-toggle', 'modal');
            book_view.purchaseBt.setAttribute('data-bs-target', '#confirmationModal');
        });
    }
    /*****
     * Load Effect
     * ****/
    document.getElementsByClassName('loader')[0].remove();
    mainView.style.filter = "blur(0)";
    /***
     * Load Other Reviews Later
     * ***/
    //userReview(misc.ID, true);
}