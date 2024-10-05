export default function loadAuthorPage(authorData, No, role) {
    // Page Title
    book_view.authorTitle.innerText = role;
    // Page Switcher
    book_view.author_page.innerText = No;
    // Name
    book_view.authorName.innerHTML = authorData.name;
    // Profile
    if (authorData.profile != null) {
        book_view.authorProfile.style.filter = " ";
        book_view.authorProfile.src = authorData.profile;
    } else {
        book_view.authorProfile.src = "assets/profile.png";
    }
    // About
    book_view.authorInfo.innerHTML = authorData.info.slice(0, 460);
    // Dates
    book_view.authorDOB_date.innerText = new Date(authorData.birthday).getFullYear();
    book_view.authorDOB.innerText = `ولد في ${authorData.birthplace} ,`;
    book_view.authorDOD.innerHTML = `توفى في <span class="fw-bold fs-6" id="authorDOD_date" style="font-family: NumberFont, serif;font-size: 18px">${authorData.died}</span>`;
}