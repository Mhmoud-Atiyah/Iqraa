//---------------------------------------------------------
// Main Elements
//---------------------------------------------------------
const mainView = document.getElementById("main");
const myBooks = document.getElementsByClassName("myBooks")[0];
const headerTags = document.getElementById("headerCenter");
const headerRight = document.getElementById("headerRight");
const headerLeft = document.getElementById("headerLeft");
const tagsArea = document.getElementById("tagsList");// Tags
const read_Bt = document.getElementById("read");
const statusBt = document.getElementById("status-icon");
const Dock = document.getElementById("nav");
const addBookBt = document.getElementById("addBookBt");
const homeBt = document.getElementById("home");
const libraryBt = document.getElementById("library_bt");
const riwaqBt = document.getElementById("session");
const themeBt = document.getElementById("theme-icon");
const accountBt = document.getElementById("profile-name");
const profileBt = document.getElementById("profile-pic");
const current = document.getElementById("current");
const settingBt = document.getElementById("settings");
const openBookBt = document.getElementsByClassName("openBookBt");
const openAuthorBt = document.getElementsByClassName("openAuthorBt");
const searchBt = document.getElementById("searchBt");
const searchInput = document.getElementById("search-input");
const searchListWindow = document.getElementById("search-inputList");
const searchList = document.getElementById("search-inputListItems");
const logOutBt = document.getElementById("logOutBt");
const sign = {
    alertPlaceholder: document.getElementById('alertPlaceholder'),
    signWindow: document.getElementById("signWindow"),
    loginWall: document.getElementById("login_wall"),
    signForm: document.getElementById("signForm"),
    signProfile: document.getElementById("signProfileImg"),
    loginBt: document.getElementById("loginBt"),
    signUpBt: document.getElementById('signUpBt'),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    passwordIcon: document.getElementById("passwordIcon"),
    remeberMe: document.getElementById("remeberMe"),
    signUpGoogleBt: document.getElementById("signUpGoogleBt"),
    signUpMSBt: document.getElementById("signUpMSBt")
};
const book_view = {
    view: document.getElementsByClassName("book_view")[0],
    Modal: document.getElementById("ModalPlaceHolder"),
    UserComments: document.getElementById("UserCommentsSpace"),
    cover: document.getElementById("book_view_cover"),
    title: document.getElementById("book_view_title"),
    pagesCount: document.getElementById("book_view_pagesCount"),
    readCount: document.getElementById("book_view_readCount"),
    pubDate: document.getElementById("book_view_pubDate"),
    rating: document.getElementById("book_view_rating"),
    ratingNumber: document.getElementById("book_view_rating_number"),
    readBt: document.getElementById("book_view_readBt"),
    readNowBt: document.getElementById("book_view_readNowBt"),
    wantreadBt: document.getElementById("book_view_wantreadBt"),
    purchaseBt: document.getElementById("book_view_purchaseBt"),
    authorPage: document.getElementById("authorPage"),
    authorPageSpinner: document.getElementById("authorPageSpinner"),
    author_page: document.getElementById("author_pageNo"),
    author_prev: document.getElementById("author_prev"),
    author_next: document.getElementById("author_next"),
    authorTitle: document.getElementsByClassName("authorDataTitle")[0],
    authorName: document.getElementById("authorName"),
    authorProfile: document.getElementById("authorProfile"),
    authorInfo: document.getElementById("authorInfo"),
    authorDOB: document.getElementById("authorDOB"),
    authorDOB_date: document.getElementById("authorDOB_date"),
    authorDOD: document.getElementById("authorDOD"),
    bookAbout: document.getElementById("book_viewAbout"),
    riwaqList: document.getElementById("riwaqSection"),
    suggestionList: document.getElementById("suggestionList"),
    bookTagsList: document.getElementById("book_tags"),
    bookTag: document.getElementsByClassName("book_tag_bt")
}
const riwaq = {
    initBt: document.getElementById("initBt"),
    initModal: document.getElementById("initSession"),
    initSessionBt: document.getElementById("initSessionBt"),
    joinSessionBt: document.getElementById("joinSessionBt"),
    initIcon: document.getElementById("initIcon"),
    BookNameInput: document.getElementById("BookName"),
    BookNameField: document.getElementById("BookNameField"),
    sessionIdInput: document.getElementById("sessionId"),
    sessionIdField: document.getElementById("sessionIdField"),
    markersBt: document.getElementById("markersBt"),
    markersModal: document.getElementById("markersList"),
    markersIcon: document.getElementById("markersIcon"),
    micIcon: document.getElementById("microphone-icon"),
    speakerIcon: document.getElementById("speaker-icon"),
    cameraIcon: document.getElementById("camera-icon"),
    UsersBt: document.getElementById("users-icon"),
    SessionSideBt: document.getElementById("SessionSideBt"),
    SessionInfoBt: document.getElementById("SessionInfoBt"),
    AcademyModeBt: document.getElementById("AcademyModeBt"),
    UsersWindow: document.getElementById("conversationUsers"),
    myScreen: document.getElementById("myScreenVideo"),
    messageSection: document.getElementById("messageInput"),
    messageInput: document.getElementById("messageInputText_in"),
    emojiBt: document.getElementById("messageInputEmoji"),
    emojiPicker: document.getElementById("emoji-picker"),
    addFileBt: document.getElementById("messageInputAdd"),
    addFileIn: document.getElementById("messageInputAddFile"),
    addFileScreen: document.getElementById("messageInputAddScreen"),
    Side: document.getElementById("Side")

}
const library = {
    librariesButtons: document.getElementById("headerCenterBTs"),
    initBt: document.getElementById("initBt"),
    initModal: document.getElementById("initLibrary"),
    initLibraryBt: document.getElementById("initLibraryBt"),
    joinLibraryBt: document.getElementById("joinLibraryBt"),
    initIcon: document.getElementById("initIcon"),
    libraryNameField: document.getElementById("LibraryNameField"),
    libraryNameInput: document.getElementById("LibraryName"),
    libraryIDField: document.getElementById("libraryIdField"),
    libraryIDInput: document.getElementById("LibraryID"),
    LibraryInfoBt: document.getElementById("LibraryInfoBt"),
    PartiesBt: document.getElementById("partiesBt"),
    ExtensionsBt: document.getElementById("ExtensionsBt"),
    AdminModeBt: document.getElementById("AdminModeBt"),
    OCRBt: document.getElementById("OCRBt"),
    OCRScreen: document.getElementById("OCRScreen")
}