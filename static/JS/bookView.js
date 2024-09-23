import misc from "./misc.js";
import showHideSecondaryWindow from "./SecondaryWindow.js";
import loadBookDataPage from "../components/loadBookDataPage.js";
import AddToMyBooks from "../components/addToMyBooks.js";

const BookID = misc.getQueryParams().bookId;

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
    if (misc.ID !== undefined) {
        // Retrieve Data First
        misc.getData(`loadBookData/${misc.ID}/${BookID}`).then(bookData => {
            document.title = `كتاب ${bookData.title} للكاتب ${bookData.author.name}`
            loadBookDataPage(bookData);
        }).then(() => {
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
                        misc.getData(`loadConfig/${misc.ID}`).then((config) => {
                            showHideSecondaryWindow("إضافة كتاب", AddToMyBooks(config.tags), "إضافة");
                            let startDate,
                                endDate,
                                bookshelf = 'read',
                                review = '',
                                bookShelves = [""],
                                rate = 0.0;
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
                                for (let i = 0; i < document.getElementsByClassName('bookshelfBt').length; i++) {
                                    
                                }
                                bookShelves = [];
                                /**********
                                 * Post Data
                                 *  *******/
                                misc.postData("addToMyBooks", {
                                    bookId: BookID,
                                    userId: misc.ID,
                                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                                    data: [startDate, endDate, bookshelf, review, bookShelves, rate]
                                }).then((res) => {
                                    if (!res) {
                                        console.log(res.msg);
                                        showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
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
                    showHideSecondaryWindow("تنبيه", "أنت على وشك حذف الكتاب <br>ستؤدي إزالة هذا الكتاب إلى مسح التقييم والمراجعة وكافة البيانات المرتبطة به.", "حذف");
                    misc.postData('deleteFromMyBooks', {
                        userId: misc.ID,
                        hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                        bookId: BookID
                    }).then(res => {
                        if (!res.status) {
                            book_view.readBt.style.backgroundColor = "transparent";
                            book_view.readBt.setAttribute("data-active", "false");
                        } else {
                            console.log(res.msg);
                        }
                    });
                }
            };
            // Add book to user's table (WANT)
            book_view.wantreadBt.onclick = () => {
                /* Get Data from User */
                let dateRead = new Date("0"),
                    dateAdd = new Date(),//current Date
                    bookshelf = 'to-read',
                    bookShelves = ["testTag"],
                    myRate = 0.0;
                showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
                /* Post Data to Server */
                misc.postData("addToMyBooks", {
                    bookId: BookID,
                    userId: misc.ID,
                    hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
                    data: [dateRead, dateAdd, bookshelf, bookShelves, myRate]
                }).then((response) => {
                    console.log(response);
                    showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
                });
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
        });
    }
};

//TODO: on reply on comment open same top windows as thread between two users like future RIWAQ

//TODO: عاوزين نحسن شكل النجوم بتاعت الريت