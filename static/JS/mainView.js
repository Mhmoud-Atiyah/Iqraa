const ID = getQueryParams().userId; // get ID of User Open The Window
// Main Routine On start
window.onload = () => {
    getData(`loadConfig/${ID}`).then((config) => { // Global Config not User Config
        /* Dark mode setting */
        if (config.mode === "dark") { // Now is Dark
            themeBt.className = "fa-solid fa-sun";
            statusBt.setAttribute("data-mode", "dark");
            loadTheme("darkTheme");
        } else {    // Now is Light
            themeBt.className = "fa-solid fa-moon";
            statusBt.setAttribute("data-mode", "light");
            loadTheme("lightTheme");
        }
        /* Connection Setting */
        if (config.connection === "true") { // Now is online
            statusBt.className = "fa-solid fa-signal";
            statusBt.setAttribute("data-mode", "on");
        } else {    // Now is offline
            statusBt.className = "fa-solid fa-plane";
            statusBt.setAttribute("data-mode", "off");
        }
        /* Dock Settings */
        if (config.dock === "show") {
            Dock.style.display = "block";
        } else if (config.dock === "auto-hide") {
            //TODO: Do it's staff
        }
        /* Main View Components */
        accountBt.innerText = config.firstName + " " + config.lasttName;
        if (config.current.id != "") {
            current.src = config.current.cover;
            current.title = config.current.title;
            current.className = "cursorBt openBookBt";
        } else {
            current.src = config.current.cover;
            current.title = config.current.title;
            current.className = "cursorBt";
        }
        profileBt.src = config.profile;
        profileBt.alt = config.account;
        current.src = config.current.cover;
        current.title = config.current.title;
        current.setAttribute("data-path", config.current.id);
        for (let index = 0; index < config.lastSearch.length; index++) {
            let elem = document.createElement("li");
            elem.className = "dropdown-item";
            elem.innerText = config.lastSearch[index];
            //TODO: Append last search to tags Bar
            // searchList.append(elem);
        }
        // First look User ( run one time !)
        if (config.new === "true") {
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
                                <input class="form-control" type="file" style="display:none" id="browse_file_input" accept=".json">
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
                    if (document.getElementById("browse_file_input").value != "") {
                        let filePath = document.getElementById("browse_file_input").files[0].path;
                        postData(`goodreads`, { id: ID, filepath: filePath })
                            .then(() => {
                                getData(`editConfig/${ID}/new|false`).then((res) => {
                                    if (res) {
                                        console.log("data loaded");
                                        // Clear Screen
                                        while (mainView.firstChild) {
                                            // Remove each child element
                                            mainView.removeChild(mainView.firstChild);
                                        }
                                        //TODO: Loading Message or sign or gif
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    }
                                });
                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });
                    }
                }
            }
        };
    })
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
}
//---------------------------------------------------------
// Global Event Listener
//---------------------------------------------------------
/* Open Book */
for (let index = 0; index < openBookBt.length; index++) {
    openBookBt[index].onclick = () => {
        window.IPC.openBookWindow(openBookBt[index].getAttribute("data-path"));
    }
}
//---------------------------------------------------------
// Main Window's Event Listeners
//---------------------------------------------------------
// Connection Button
//TODO: اقفل او افتح اللي مفروض يتعمل بعد قفل او فتح الاتصال
statusBt.onclick = () => {
    if (statusBt.getAttribute("data-mode") === "on") {
        getData(`editConfig/${ID}/connection|false`).then((res) => {
            if (res) {
                setTimeout(() => {
                    statusBt.setAttribute("data-mode", "off");
                    statusBt.className = "fa-solid fa-plane";
                }, 500);
            }
        });
    } else {
        getData(`editConfig/${ID}/connection|true`).then((res) => {
            if (res) {
                setTimeout(() => {
                    statusBt.setAttribute("data-mode", "on");
                    statusBt.className = "fa-solid fa-signal";
                }, 500);
            }
        });
    }
}
// Theme Button
themeBt.onclick = () => {
    if (themeBt.getAttribute("data-mode") === "light") {
        getData(`editConfig/${ID}/mode|dark`).then((res) => {
            if (res) {
                document.querySelector("style").remove();
                themeBt.setAttribute("data-mode", "dark");
                themeBt.className = "fa-solid fa-sun";
                loadTheme("darkTheme");
            }
        });
    } else {
        getData(`editConfig/${ID}/mode|light`).then((res) => {
            if (res) {
                document.querySelector("style").remove();
                themeBt.setAttribute("data-mode", "light");
                themeBt.className = "fa-solid fa-moon";
                loadTheme("lightTheme");
            }
        });
    }
}
addBookBt.onclick = () => { window.IPC.openAddBookWindow(); }
/* Setting button */
settings.onclick = () => { window.IPC.openSettingWindow(); }
/* Notes button */
notesBt.onclick = () => { window.IPC.openNotesWindow(); }
/* Library button */
libraryBt.onclick = () => { window.IPC.openLibraryWindow(ID); }
/* Riwaq button */
riwaqBt.onclick = () => { window.IPC.openRiwaqWindow(ID); }
//---------------------------------------------------------
// Back End Work
//---------------------------------------------------------
/* Search Staff */

searchInput.onclick = () => {
    searchList.style.display = "block"
};
searchInput.oninput = () => {
    if (searchInput.value.length >= 3) {
        searchList.innerHTML = "";
    }
}

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the form from submitting
        getData(`search/${query}`).then((res) => {
            if (res.Success == "1") {
                //TODO: Do Showing of results staff

            } else {
                console.log("Error Search!");
            }
        })
    }
});