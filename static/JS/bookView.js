function getData(path) {
    let obj = fetch(`http://localhost:1999/${path}`, {
        method: 'GET',
        headers: {
            "Accept": "application/json"
        },
    }).then(response => response.json())
    return obj;
};
// Function to get ID Of User
function getQueryParams() {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    const params = {};
    vars.forEach(v => {
        const pair = v.split("=");
        params[pair[0]] = decodeURIComponent(pair[1]);
    });
    return params;
}
const ID = getQueryParams().bookId;
/**
* Converts a number to its Arabic numeral representation.
*
* @param {number} number - The number to convert.
* @returns {string} The Arabic numeral representation of the number.
*/
function convertToArabicNumeral(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const numberString = number.toString();
    let arabicNumber = '';

    for (let i = 0; i < numberString.length; i++) {
        const char = numberString[i];
        if (char === '.') {
            arabicNumber += ',';
        } else {
            const digit = parseInt(char);
            arabicNumber += arabicNumerals[digit];
        }
    }

    return arabicNumber;
}
const book_view = {
    view: document.getElementsByClassName("book_view")[0],
    cover: document.getElementById("book_view_cover"),
    title: document.getElementById("book_view_title"),
    pagesCount: document.getElementById("book_view_pagesCount"),
    pubDate: document.getElementById("book_view_pubDate"),
    rating: document.getElementById("book_view_rating"),
    readBt: document.getElementById("book_view_readBt"),
    readNowBt: document.getElementById("book_view_readNowBt"),
    wantreadBt: document.getElementById("book_view_wantreadBt"),
    noteBt: document.getElementById("book_view_noteBt"),
    purchaseBt: document.getElementById("book_view_purchaseBt"),
    authorName: document.getElementById("authorName"),
    authorProfile: document.getElementById("authorProfile"),
    authorBirth: document.getElementById("authorBirth"),
    authorInfo: document.getElementById("authorInfo"),
    bookAbout: document.getElementById("book_viewAbout"),
    bookTags: document.getElementsByClassName("book_tag_bt"),
}

/**
* @function loadBookDataPage
* @param {*} path the link contains the data of book
* @description load the main book viewer with specific data
*/
function loadBookDataPage(bookData) {
    book_view.cover.src = bookData.coverSrc;
    book_view.title.innerHTML = bookData.title;
    //TODO: pubDate
    //book_view.pubDate.innerHTML = convertToArabicNumeral(bookData.pubDate)
    book_view.pagesCount.innerHTML = convertToArabicNumeral(bookData.pagesCount.split(" ")[0]) + " صفحة ";
    book_view.rating.innerHTML = " تقييم " + convertToArabicNumeral(bookData.rating);
    //---------------------------------------------------------
    // set button data
    //---------------------------------------------------------
    //1. Already read
    book_view.readBt.setAttribute("data-path", bookData.id);
    book_view.readBt.setAttribute("data-title", bookData.title);
    //2. Reader
    book_view.readNowBt.setAttribute("data-path", bookData.readPath);
    book_view.readNowBt.setAttribute("data-title", bookData.title);
    book_view.readNowBt.setAttribute("data-img", bookData.coverSrc);
    book_view.readNowBt.setAttribute("data-info", bookData.about.slice(0, 100));
    //3. Want to read
    book_view.wantreadBt.setAttribute("data-path", bookData.id);
    book_view.wantreadBt.setAttribute("data-title", bookData.title);
    //4. note
    book_view.noteBt.setAttribute("data-path", bookData.id);
    book_view.noteBt.setAttribute("data-title", bookData.title);
    //5. purchase
    book_view.purchaseBt.setAttribute("data-path", bookData.purchasePath);
    //set author data
    book_view.authorName.innerHTML = bookData.author.name;
    book_view.authorProfile.src = bookData.author.profile;
    book_view.authorBirth.innerHTML = bookData.author.birth;
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
    getData(`loadBookData/${ID}`).then(data => {
        loadBookDataPage(data);
    });
}