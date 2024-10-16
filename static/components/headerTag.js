export default function headerTag(parent, tagId, tagText, active = false) {
    let element = document.createElement("li");
    if (!active) {
        element.innerHTML = `<a href="/tag?tagId=${tagId}" class="rounded fs-5 fw-bold tagBt">${tagText}</a>`;
    } else {
        element.innerHTML = `<a href="/tag?tagId=${tagId}" class="rounded fs-5 fw-bold tagBt tagBtActive">${tagText}</a>`;
    }
    element.className = "secondry-nav-item cursorBt ms-1";
    parent.append(element)
}