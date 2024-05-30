//---------------------------------------------------------
// Main Elements
//---------------------------------------------------------
const mainView = document.getElementById("main");
const userSection = document.getElementsByClassName("mySection");
const showOptions = document.getElementById("secondry-nav");// Tags
const read_Bt = document.getElementById("read");
const statusBt = document.getElementById("status-icon");
const Dock = document.getElementById("nav");
const addBookBt = document.getElementById("addBookBt");
const notesBt = document.getElementById("notes");
const libraryBt = document.getElementById("library_bt");
const riwaqBt = document.getElementById("session");
const themeBt = document.getElementById("theme-icon");
const accountBt = document.getElementById("profile-name");
const profileBt = document.getElementById("profile-pic");
const current = document.getElementById("current");
const settingBt = document.getElementById("settings");
const openBookBt = document.getElementsByClassName("openBookBt");
const searchList = document.getElementById("search-list");
const searchInput = document.getElementById("search-input");
const book_view = {
    view: document.getElementsByClassName("book_view")[0],
    cover: document.getElementById("book_view_cover"),
    title: document.getElementById("book_view_title"),
    pagesCount: document.getElementById("book_view_pagesCount"),
    pubDate: document.getElementById("book_view_pubDate"),
    ratingStars: document.getElementsByClassName("ratingBt"),
    rating: document.getElementById("book_view_rating"),
    readBt: document.getElementById("book_view_readBt"),
    readNowBt: document.getElementById("book_view_readNowBt"),
    wantreadBt: document.getElementById("book_view_wantreadBt"),
    purchaseBt: document.getElementById("book_view_purchaseBt"),
    authorName: document.getElementById("authorName"),
    authorProfile: document.getElementById("authorProfile"),
    authorBirth: document.getElementById("authorBirth"),
    authorInfo: document.getElementById("authorInfo"),
    bookAbout: document.getElementById("book_viewAbout"),
    bookTags: document.getElementsByClassName("book_tag_bt"),
}