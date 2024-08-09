/**
 * @brief Asynchronously creates and appends a search result item to the search list.
 *
 * @param {string} id - The ID of the search result.
 * @param {string} tittle - The title of the search result.
 * @param {string} author - The author of the search result.
 * @param {string} cover - The URL of the cover image of the search result.
 */
export default async function searchResponse(id, tittle, author, cover) {
    let li = document.createElement("li");
    li.className = "search-inputListItem pe-3 pt-1 pb-1 cursorBt";
    li.innerHTML = `
    <div class="row openBookBt" data-id="${id}">
        <div class="col-4">
            <img src="${cover}" height="54px" width="54px">
        </div>
        <div class="col-8 search-inputListItemText">
        <!-- TODO: add attributes for English -->
            <p>${tittle}</p>
            <span><a class="openAuthorBt" href="#">${author}</a></span>
        </div>
    </div>
    `;
    // Assuming searchList is defined somewhere in your code
    if (searchList) {
        searchList.append(li);
    } else {
        console.error('Search list element not found.');
    }
}