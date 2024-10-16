export default function addLibraryButton(libraryData) {
    let a = document.createElement('a');
    a.innerHTML = `
    <a 
        href="/library?libraryId=${libraryData.id}"
        data-libraryId="${libraryData.id}"
        class="headerCenterBt rounded fs-5 fw-bold tagBt" 
        title="${libraryData.title}">
        ${libraryData.title}
    </a>
    `;
    tagsArea.append(a);
}