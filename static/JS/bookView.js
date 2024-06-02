const ID = getQueryParams().bookId;
/**
* @function loadBookDataPage
* @param {*} path the link contains the data of book
* @description load the main book viewer with specific data
*/
function loadBookDataPage(bookData) {
    book_view.cover.src = bookData.coverSrc;
    book_view.cover.title = bookData.title;
    book_view.cover.style.filter = "";
    book_view.title.innerHTML = bookData.title;
    book_view.pubDate.innerText = bookData.pubDate;
    //book_view.pubDate.innerHTML = convertToArabicNumeral(bookData.pubDate)
    book_view.pagesCount.innerHTML = convertToArabicNumeral(bookData.pagesCount.split(" ")[0]) + " صفحة ";
    book_view.ratingStars[5 - Math.floor(bookData.rating)].click();
    //---------------------------------------------------------
    // set button data
    //---------------------------------------------------------
    //1. Already read
    book_view.readBt.setAttribute("data-path", bookData.id);
    book_view.readBt.setAttribute("data-title", bookData.title);
    //TODO: 2. Reader
    // book_view.readNowBt.setAttribute("data-path", bookData.readPath);
    // book_view.readNowBt.setAttribute("data-title", bookData.title);
    // book_view.readNowBt.setAttribute("data-img", bookData.coverSrc);
    // book_view.readNowBt.setAttribute("data-info", bookData.about.slice(0, 100));
    //3. Want to read
    book_view.wantreadBt.setAttribute("data-path", bookData.id);
    book_view.wantreadBt.setAttribute("data-title", bookData.title);
    //4. purchase
    book_view.purchaseBt.setAttribute("data-title", bookData.id);
    //set author data
    book_view.authorName.innerHTML = bookData.author.name;
    book_view.authorProfile.src = bookData.author.profile;
    book_view.authorProfile.style.filter = "";
    book_view.authorInfo.innerHTML = bookData.author.info;
    // set book about data
    book_view.bookAbout.innerHTML = bookData.about;
    // set tags
    for (let index = 0; index < book_view.bookTags.length; index++) {
        const element = book_view.bookTags[index];
        element.setAttribute("data-path", bookData.tags[index]);
        element.innerText = bookData.tags[index];
    }
}
window.onload = () => {
    getData("loadConfig").then((config) => { // Global Config
        /* Dark mode setting */
        if (config.mode === "dark") { // Now is Dark
            loadTheme("darkTheme");
        } else {    // Now is Light
            loadTheme("lightTheme");
        }
    })
    getData(`loadBookData/${ID}`).then(data => {
        document.title = `كتاب ${data.title} للكاتب ${data.author.name}`
        loadBookDataPage(data);
    });
}
//TODO: on read button click show window inside page for info about book like date of end and rating and so on

//TODO: on reply on comment open same top windows as thread between two users like future RIWAQ

//TODO: عاوزين نحسن شكل النجوم بتاعت الرات

//TODO: on load book data check if it read or want so it will check the button

//TODO: read now need reader software