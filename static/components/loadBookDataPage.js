import misc from "../JS/misc.js";
import userReview from "./userReview.js";

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
    /***
     * Rating
     * */
    if (bookData.avgrating !== 0) {
        book_view.ratingNumber.innerText = bookData.avgrating;
        let Span = document.createElement('span');
        /***
         * ThanksTO: https://codepen.io/FredGenkin
         * */
        Span.innerHTML = `<span class="book_view_rating_stars" style="--rating: ${bookData.avgrating};"></span>`;
        book_view.rating.append(Span);
    }
    /****
     * Activate Buttons
     * */
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
    /***
     * Purchase Option Availability
     * */
    if (bookData.purchase != null && bookData.purchase.length > 0) {
        /*TODO: Show Modal Contain all Available Paths of purchase */
    }
    /***
     * Author data
     * */
    if (!Array.isArray(bookData.authorids)) {
        document.getElementById('author_prev').style.display = 'none';
        document.getElementById('author_next').style.display = 'none';
        book_view.author_page.style.display = 'none';
        document.getElementsByClassName('authorDataTitle_')[0].style.paddingBottom = '6px';
    } else {
        book_view.author_page.innerText = '1';
    }
    book_view.authorName.innerHTML = bookData.author.name;
    if (bookData.author.profile != null) {
        book_view.authorProfile.style.filter = " ";
        book_view.authorProfile.src = bookData.author.profile;
    } else {
        book_view.authorProfile.src = "assets/profile.png";
    }
    book_view.authorInfo.innerHTML = bookData.author.info.slice(0, 460);
    book_view.authorDOB_date.innerText = new Date(bookData.author.birthday).getFullYear();
    book_view.authorDOB.innerText = `ولد في ${bookData.author.birthplace} ,`;
    book_view.authorDOD.innerHTML = `توفى في <span class="fw-bold fs-6" id="authorDOD_date" style="font-family: NumberFont, serif;font-size: 18px">${bookData.author.died}</span>`;
    /***
     * Book about
     * */
    book_view.bookAbout.innerHTML = bookData.about;
    /***
     * Tags
     * */
    if (bookData.tags != null && bookData.tags[0] !== "") {
        // TODO: Fix error of font on chrome
        for (let index = 0; index < bookData.tags.length; index++) {
            // TODO: Redirect to Main Page with tag Active
            const element = document.createElement('a');
            element.href = `/tag?tagId=${bookData.tags[index]}`;
            element.className = "book_tag_bt Btn";
            element.innerText = bookData.tags[index];
            book_view.bookTagsList.append(element);
        }
    }
    /***
     * Load My Review
     * */
    // TODO: check if he has review
    userReview(misc.ID, true);
    /***
     * Reviews
     * */
    if (Array.isArray(bookData.reviewids)) {
        if (bookData.reviewids.length <= misc.maximumReviewsPage) {
            for (let i = 0; i < bookData.reviewids.length; i++) {
                /****
                 * Show first maximumReviewsPage which are sorted already
                 * */
                userReview(bookData.reviewids[i]);
            }
        } else {
            for (let i = 0; i < misc.maximumReviewsPage; i++) {
                /****
                 * Show first maximumReviewsPage which are sorted already
                 * */
                userReview(bookData.reviewids[i]);
            }
        }

    }
}
