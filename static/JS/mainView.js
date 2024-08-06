// Main Routine On start
window.onload = () => {
    getData(`loadConfig/${ID}`).then((config) => { // Global Config not User Config
        /* Dock Settings */
        if (config.dock === "show") {
            Dock.style.display = "block";
        } else if (config.dock === "auto-hide") {
            //TODO: Do it's staff
        }
        /* Current Book */
        //TODO: put get method to get record
        if (config.currentid === "sa") {
            current.src = config.current.cover;
            current.title = config.current.title;
            current.className = "cursorBt openBookBt";
            current.setAttribute("data-path", config.current.id);
            current.onclick = () => {
                window.IPC.openBookWindow(current.getAttribute("data-path"), ID);
            }
        } else {
            current.src = "assets/bookCover.jpg";
            current.title = "غلاف كتاب";
            current.className = "cursorBt";
        }
        // First look User ( run one time !)
        if (config.newuser) {
            let element =
                `
                <div class="newSection position-relative overflow-hidden m-md-2 text-center rounded">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: DecorationFont3;">أنا من بدل بالكتب الصحابا<br> لم أجد لي وافيا إلا الكتابا</h1>
                        <h1 class="display-4 fw-normal">يبدو أنك مستعد</h1>
                        <p class="lead fw-normal fs-3"> لديك خيارات مختلفة لتجميع مكتبتك<br>
                            &nbsp بالبحث عن الكتاب&nbsp أو&nbsp إضافة كتاب يدوي<br> أو&nbspبجلبها من مكان آخر</p>
                        <a class="btn fw-bold fs-4 ms-1 border" style="line-height: 1em;color: var(--App-navTextColor);" href="#" id="browse_file">
                            اختر ملف<i class="fa-solid fa-file-import me-1"></i>
                                <form id="uploadForm" enctype="multipart/form-data" action="/goodreads/${ID}" method="post">
                                    <input class="form-control" type="file" name="file" style="display:none" id="browse_file_input" accept=".json">
                                    <button type="submit" id="browse_file_submit" style="display: none"></button>
                                </form>
                            </a>
                        <a class="btn ms-1 border border-secondary" href="">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
                                height="22px"></a>
                        <a class="btn btn-outline-secondary ms-1" style="background-color: #e8c37f;color: rgb(105, 39, 39);"
                            href="https://github.com/Mhmoud-Atiyah/qiraa/blob/master/DOC/goodreads.md" target="_blank">Goodreads</a>
                    </div>
                </div>
            `;
            let Div = document.createElement('div');
            Div.id = "mainChild";
            Div.innerHTML = element;
            mainView.append(Div);
            document.getElementById("browse_file").onclick = () => {
                document.getElementById("browse_file_input").click();
                    document.getElementById("browse_file_input").onchange = () => {
                        setTimeout(() => {
                            /*TODO: Loading Message or sign or gif */
                            document.getElementById("uploadForm").submit();
                            postData(`editConfig/${ID}/`, {
                                newuser: false
                            }).then((res) => {
                                if (res) {
                                console.log(res);
                                // Clear Screen
                                while (mainView.firstChild) {
                                    // Remove each child element
                                    mainView.removeChild(mainView.firstChild);
                                }
                            }
                            }).catch(error => { console.error('Error:', error); });
                    }, 2000);
                };
            }
        }
    })
document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
}
//---------------------------------------------------------
// Global Event Listener
//---------------------------------------------------------
/* Open Book */
for (let index = 0; index < openBookBt.length; index++) {
    openBookBt[index].onclick = () => {
        if (!isElectron()) {
            /*TODO: Open Book view*/
        } else {
            window.IPC.openBookWindow(openBookBt[index].getAttribute("data-path"), ID);
        }
    }
}
//---------------------------------------------------------
// Main Window's Event Listeners
//---------------------------------------------------------
/* Setting button */
settings.onclick = () => {
    /*TODO: Set it right and responsive */
    showHideSecondaryWindow();
}
/* Library button */
libraryBt.onclick = () => {
    if (!isElectron()) {
        window.location.href = `https://${DOMAIN}/library?userId=${ID}`;
    } else {
        window.IPC.openLibraryWindow(ID);
    }
}
/* Riwaq button */
riwaqBt.onclick = () => {
    if (!isElectron()) {
        window.location.href = `https://${DOMAIN}/riwaq?userId=${ID}`;
    } else {
        window.IPC.openRiwaqWindow(ID);
    }
}
//---------------------------------------------------------
// Back End Work
//---------------------------------------------------------
/* Search Staff */
// TODO: There is no database for Iqraa, and currently I'm using Goodreads so Searching isn't the best thing!
function searchResponse(id, tittle, author, cover) {
    let li = document.createElement("li");
    li.className = "search-inputListItem pt-2 pe-3";
    li.innerHTML = `
    <div class="row">
        <div class="col-4">
            <img src="${cover}" height="64px" width="64px" class="openSearhcBookBt rounded" data-id="${id}">
        </div>
        <div class="col-8">
            <p data-id="${id}" class="openSearhcBookBt">${tittle}</p>
            <span class="viewAuthorBt"><a href="#">${author}</a></span>
        </div>
    </div>
    `;
    searchList.append(li);
}

function doSearch(query) {
    getData(`search/${query}`).then((response) => {
        // Front Tip
        if (response.length > 3) {
            searchinputList.style.height = "270px";
        } else {
            searchinputList.style.height = "auto";
        }
        // Append Responses to view
        for (let index = 0; index < response.length; index++) {
            searchResponse(response[index].src,
                response[index].Title.slice(0, 30),
                response[index].Author.slice(0, 30),
                response[index].ImageSrc);
        }
        ;
        // Add two Event Handlers for same response to open Book View
        const openBookBt_ = document.getElementsByClassName("openSearhcBookBt");
        for (let index = 0; index < openBookBt_.length; index++) {
            openBookBt_[index].onclick = () => {
                // Downlaod Book Data from Goodreads
                let bookId = openBookBt_[index].getAttribute("data-id").split("/")[5].split(".")[0];
                window.IPC.openBookWindow(bookId, ID);
                // TODO: Search Work Re-Vision
                // postData(`downloadBookData/`, { bookID: bookId }).then(data => {
                // })
            }
        }
    });
};
searchInput.oninput = () => {
    if (searchInput.value.length >= 3) {
        searchinputList.style.display = "block";
        // clear Window first
        searchList.innerHTML = ``;
        // Do Search
        // TODO: Contain a lot of Errors
        setTimeout(() => {
            // Put some Delay for errors and Decrease impact of always search!
            searchList.innerHTML = ``;
            doSearch(searchInput.value);
        }, 2000);
    } else {
        searchinputList.style.display = "none";
    }
}
// Searching Routine
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the form from submitting
        doSearch(searchInput.value);
    }
});