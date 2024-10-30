export default function addLibraryButton(libraryData, active = false) {
    let element = document.createElement("li");
    if (!active) {
        element.innerHTML = `<a href="/library?libraryId=${libraryData.id}" class="rounded fs-5 fw-bold tagBt">${libraryData.title}</a>`;
    } else {
        element.innerHTML = `<a href="/library?libraryId=${libraryData.id}" class="rounded fs-5 fw-bold tagBt tagBtActive">${libraryData.title}</a>`;
    }
    element.className = "secondry-nav-item cursorBt ms-1";
    tagsArea.append(element)
}