import misc from "../JS/misc.js";

/**
 * @function loadBookDataPage
 * @description load the main book viewer with specific data
 * @param bookData
 */
export default function loadBookDataPage(bookData) {
    /**********
     * Book data
     * ********/
    book_view.cover.src = bookData.coversrc;
    book_view.cover.title = bookData.title;
    book_view.cover.style.filter = "";
    book_view.title.innerHTML = bookData.title;
    book_view.pubDate.innerHTML = "نشر في عام&nbsp;" + misc.convertToArabicNumeral(bookData.pubdate) + "&nbsp;من خلال&nbsp;" + bookData.publisher;
    book_view.pagesCount.innerHTML = misc.convertToArabicNumeral(bookData.pagescount) + " صفحة ";
    book_view.readCount.innerHTML = "قرأ الكتاب&nbsp;" + misc.convertToArabicNumeral(bookData.readcount) + "&nbsp;قارئ";
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
    if (bookData.purchase != null && bookData.purchase.length > 0) {
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
    if (bookData.tags != null && bookData.tags[0] !== "") {
        for (let index = 0; index < bookData.tags.length; index++) {
            // TODO: Future we will show main window based on tag
            const element = document.createElement('a');
            element.className = "book_tag_bt Btn";
            element.innerText = bookData.tags[index];
            book_view.bookTagsList.append(element);
        }
    }
    /* Book Reviews */
    if (bookData.reviewids != null) {
        for (let i = 0; i < misc.maximumReviewsPage; i++) {
            /* Show first maximumReviewsPage which are sorted already */
            loadBookReview(bookData.reviewids[i]);
        }
    }
}
