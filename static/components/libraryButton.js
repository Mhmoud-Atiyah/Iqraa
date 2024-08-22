export default function addLibraryButton(libraryData, location, userId) {
    const domain = location.split("library")[0];
    const elem = `
    <a 
        href="${domain}library?libraryId=${libraryData.id}&userId=${userId}"
        data-libraryId="${libraryData.id}"
        class="headerCenterBt ms-2 rounded" 
        title="${libraryData.title}">
        ${libraryData.title}
    </a>
    `;
    let a = document.createElement('a');
    a.innerHTML = elem;
    document.getElementById("headerCenterBTs").append(a);
}