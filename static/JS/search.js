/* searchResponse Component */
import searchResponse from '../components/searchResult.js';

/* Main Routine */
searchInput.oninput = () => {
    if (searchInput.value.length >= MinimumSearchInput) {
        // clear Window first
        searchList.innerHTML = ``;
        // Do Search
        doSearch(searchInput.value);
    } else {
        /* this condition to clear screen on delete input */
        searchListWindow.style.display = "none";
    }
}

// Searching Routine
function doSearch(query) {
    postData('search', {query: query}).then((responses) => {
        if (responses.result != null) {
            const Entries = responses.result;
            // Adjust Height
            searchListWindow.style.display = "block";
            Entries.length > 3 ? searchListWindow.style.height = "256px" : searchListWindow.style.height = "auto";
            // Show Results
            Entries.forEach(response => {
                searchResponse(response.id, response.title.slice(0, 30), response.authorName.slice(0, 22), response.coversrc);
            });
            // Add Event Handlers to open Book View
            for (let i = 0; i < openBookBt.length; i++) {
                openBookBt[i].onclick = () => {
                    if (!isElectron()) {
                        window.location.href = `https://${DOMAIN}/bookview?userId=${ID}&bookId=${openBookBt[i].getAttribute("data-id")}`;
                    } else {
                        window.IPC.openBookWindow(openBookBt[i].getAttribute("data-id"), ID);
                    }
                }
            }
        } else {
            console.log(responses.msg);
        }
    })
}

/* Event Listener */
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the form from submitting
        doSearch(searchInput.value);
    }
});
/* on focus */
searchInput.addEventListener('click', () => {
    searchListWindow.style.display = "block";
})
/* on lose focus */
searchInput.addEventListener('blur', () => {
    //TODO: searchListWindow.style.display = "none";
})