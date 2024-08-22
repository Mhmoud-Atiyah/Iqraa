const BookID = getQueryParams().bookId;

const addBookModal = `
<form id="addBookModal" style="user-select: none;margin-top: 10px">
  <div id="addBookModal_dateAdd">
    <label>تاريخ الإضافة</label>
    <i class="fa-regular fa-calendar-plus" style="position: relative;right: 30px;z-index: 1;color: var(--App-iconColor)" id="addBookModal_dateAddBt"></i>
    <input type="date" id="addBookModal_dateAddIn" style="display: none">
    <input type="text" id="addBookModal_dateAddOut" value="${new Date().getDay()} / ${new Date().getMonth()} / ${new Date().getFullYear()}" 
        min="2018-01-01" max="2018-12-31" class="rounded pt-1" disabled
            style="font-family: NumberFont,serif;text-align: center;z-index: 0;
                    color: var(--App-textColor);margin-bottom: 10px;"/>
  </div>
  <div id="addBookModal_dateRead">
  <label>تاريخ القراءة</label>
    <i class="fa-regular fa-calendar-plus" style="position: relative;right: 35px;z-index: 1;color: var(--App-iconColor)" id="addBookModal_dateReadBt"></i>
    <input type="date" id="addBookModal_dateReadIn" style="display: none">
    <input type="text" id="addBookModal_dateReadOut" value="${new Date().getDay()} / ${new Date().getMonth()} / ${new Date().getFullYear()}" 
        min="2018-01-01" max="2018-12-31" class="rounded pt-1" disabled
            style="font-family: NumberFont,serif;text-align: center;z-index: 0;
                    color: var(--App-textColor);margin-bottom: 10px;
                    position: relative; left: -5px"/>
</div>
  <div id="addBookModal_bookshelves">
  <!-- see if get data from database as Buttons or give him options selection -->
</div>
  <div id="addBookModal_rate">
  <!-- change class name for all star to avoid mis in main stars -->
    <p style="font-family: TheYearofTheCamelBold, serif;font-size: 16px;display: inline-block;margin-left: 62px">التقييم</p>
  <div class="rating" style="display: inline-block;direction: rtl;flex: 1 1 auto;box-sizing: border-box">
    <input type="radio" class="ratingBt" name="rating" id="star1" value="1">
        <label for="star1">&#9733;</label>
    <input type="radio" class="ratingBt" name="rating" id="star3" value="3">
        <label for="star3">&#9733;</label>
    <input type="radio" class="ratingBt" name="rating" id="star2" value="2">
        <label for="star2">&#9733;</label>
    <input type="radio" class="ratingBt" name="rating" id="star4" value="4">
        <label for="star4">&#9733;</label>
    <input type="radio" class="ratingBt" name="rating" id="star5" value="5">
        <label for="star5">&#9733;</label>
  </div>
  </div>
    <div id="addBookModal_comment">
    <!--TODO: Add comment Section -->
    </div>
</form>
`;

function loadBookReview(id) {

}

/**
 * @function loadBookDataPage
 * @description load the main book viewer with specific data
 * @param bookData
 */
function loadBookDataPage(bookData) {
    //---------------------------------------------------------
    // Book data
    //---------------------------------------------------------
    book_view.cover.src = bookData.coversrc;
    book_view.cover.title = bookData.title;
    book_view.cover.style.filter = "";
    book_view.title.innerHTML = bookData.title;
    book_view.pubDate.innerHTML = "نشر في عام&nbsp;" + convertToArabicNumeral(bookData.pubdate) + "&nbsp;من خلال&nbsp;" + bookData.publisher;
    book_view.pagesCount.innerHTML = convertToArabicNumeral(bookData.pagescount) + " صفحة ";
    book_view.readCount.innerHTML = "قرأ الكتاب&nbsp;" + convertToArabicNumeral(bookData.readcount) + "&nbsp;قارئ";
    // TODO: add Different Rate on secondary window for user rating and disabled this main rating since it's gloabal rate
    if (bookData.avgrating !== 0) {
        book_view.ratingStars[5 - Math.floor(bookData.avgrating)].click();
    }
    //---------------------------------------------------------
    // set button data
    //---------------------------------------------------------
    // Activate Buttons
    switch (bookData.bookshelf) {
        case "read":
            book_view.readBt.style.backgroundColor = "var(--App-panelBorderColor)";
            book_view.readBt.setAttribute("data-active", "true");
            break;
        case "to-read":
            book_view.wantreadBt.style.backgroundColor = "var(--App-panelBorderColor)";
            book_view.wantreadBt.setAttribute("data-active", "true");
            break;
        default:
            console.log("no shelf")
    }
    /* Purchase Option Availability */
    if (bookData.purchase.length > 0) {
        /*TODO: Show Modal Contain all Available Paths of purchase */
    }
    //---------------------------------------------------------
    // Author data
    //---------------------------------------------------------
    //set author data
    book_view.authorName.innerHTML = bookData.author.name;
    if (bookData.author.profile != null) {
        book_view.authorProfile.style.filter = " ";
        book_view.authorProfile.src = bookData.author.profile;
    } else {
        book_view.authorProfile.src = "assets/profile.png";
    }
    book_view.authorInfo.innerHTML = bookData.author.info;
    //---------------------------------------------------------
    // set book about data
    //---------------------------------------------------------
    book_view.bookAbout.innerHTML = bookData.about;
    // set tags
    if (bookData.tags[0] !== "") {
        for (let index = 0; index < bookData.tags.length; index++) {
            // TODO: Future we will show main window based on tag
            const element = document.createElement('a');
            element.className = "book_tag_bt Btn";
            element.innerText = bookData.tags[index];
            book_view.bookTagsList.append(element);
        }
    }
    /* Book Reviews */
    for (let i = 0; i < maximumReviewsPage; i++) {
        /* Show first maximumReviewsPage which are sorted already */
        loadBookReview(bookData.reviewids[i]);
    }
}

window.onload = () => {
    /* for Mobile View */
    if (window.innerWidth <= 480) {
        document.getElementById("book_view_cover").style.left = ((window.innerWidth - 170) / 2) + 'px';
    }
    // Retrieve Data First
    getData(`loadBookData/${ID}/${BookID}`).then(bookData => {
        document.title = `كتاب ${bookData.title} للكاتب ${bookData.author.name}`
        loadBookDataPage(bookData);
    });
    // Add book to user's table (READ)
    book_view.readBt.onclick = () => {
        /* If Not Read Already */
        if (book_view.readBt.getAttribute("data-active") !== "true") {
            /* Get Data from User */
            let dateRead = new Date("0"),
                dateAdd = new Date("0"),
                bookshelf = 'read',
                bookShelves = ["testTag"],
                myRate = 0.0;
            showHideSecondaryWindow("إضافة كتاب", addBookModal, "إضافة");

            document.getElementById("addBookModal_dateAddBt").onclick = () => {
                //TODO: Create Custom Date Picker
            };
            /*  /!* Post Data to Server *!/
              postData("addToMyBooks", {
                  bookId: BookID,
                  userId: ID,
                hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                  data: [dateRead, dateAdd, bookshelf, bookShelves, myRate]
              }).then((response) => {
                  console.log(response);
                  showHideSecondaryWindow("إضافة كتاب", "تم إضافة الكتاب بنجاح", "تم");
              });*/
        } else {
            showHideSecondaryWindow("تنبيه", "أنت على وشك حذف الكتاب من بياناتك", "حذف");
            /*TODO: Remove Book from user's Table */
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
        postData("addToMyBooks", {
            bookId: BookID,
            userId: ID,
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
};

//TODO: on reply on comment open same top windows as thread between two users like future RIWAQ

//TODO: عاوزين نحسن شكل النجوم بتاعت الريت

//TODO: read now need reader software