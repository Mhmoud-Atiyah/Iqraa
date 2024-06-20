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
const searchBt = document.getElementById("searchBt");
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
    authorInfo: document.getElementById("authorInfo"),
    bookAbout: document.getElementById("book_viewAbout"),
    bookTagsList: document.getElementById("book_tags"),
    bookTag: document.getElementsByClassName("book_tag_bt")
}
const riwaq = {
    initBt: document.getElementById("initBt"),
    initModal: document.getElementById("initSession"),
    initIcon: document.getElementById("initIcon"),
    markersBt: document.getElementById("markersBt"),
    markersModal: document.getElementById("markersList"),
    markersIcon: document.getElementById("markersIcon"),
    micIcon: document.getElementById("microphone-icon"),
    speakerIcon: document.getElementById("speaker-icon"),
    cameraIcon: document.getElementById("camera-icon"),
    UsersBt: document.getElementById("users-icon"),
    UsersWindow: document.getElementById("conversationUsers"),
    messageInput: document.getElementById("messageInputText_in"),
    emojiBt: document.getElementById("messageInputEmoji"),
    emojiPicker: document.getElementById("emoji-picker"),
    addFileBt: document.getElementById("messageInputAdd"),
    addFileIn: document.getElementById("messageInputAddFile"),
    addFileScreen: document.getElementById("messageInputAddScreen"),

}
const library = {
    mainModal: document.getElementById("mainModal"),
    MM_HeaderTitle: document.getElementById("mainModalHeader_"),
    MM_Body: document.getElementById("mainModalBody"),
    MM_Bt: document.getElementById("mainModalBt_"),
    initBt: document.getElementById("initBt"),
    initModal: document.getElementById("initLibrary"),
    IM_LibraryName: document.getElementById("LibraryName"),
    IM_LibraryID: document.getElementById("LibraryID"),
    IM_initLibraryBt: document.getElementById("initLibraryBt"),
    IM_joinLibraryBt: document.getElementById("joinLibraryBt"),
    initIcon: document.getElementById("initIcon"),
    OCRBt: document.getElementById("OCRBt"),
    LibraryInfoBt: document.getElementById("LibraryInfoBt"),
    ExtensionsBt: document.getElementById("ExtensionsBt"),

}