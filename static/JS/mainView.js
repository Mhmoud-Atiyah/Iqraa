import showHideSecondaryWindow from './SecondaryWindow.js';
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
        if (!config.newuser) {
            let element = `
                <div class="newSection position-relative overflow-hidden m-md-2 text-center rounded">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: DecorationFont3,serif;">أنا من بدل بالكتب الصحابا<br> لم أجد لي وافيا إلا الكتابا</h1>
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
                                height="22px" alt="googleLogo"></a>
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
                        }).catch(error => {
                            console.error('Error:', error);
                        });
                    }, 2000);
                };
            }
        }
    })
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
}
/* Open Book */
for (let index = 0; index < openBookBt.length; index++) {
    openBookBt[index].onclick = () => {
        if (!isElectron()) {
            /*TODO: Open Book view*/
            window.location.href = `https://${DOMAIN}/bookview?userId=${ID}&bookId=${openBookBt[i].getAttribute("data-id")}`;
        } else {
            window.IPC.openBookWindow(openBookBt[index].getAttribute("data-path"), ID);
        }
    }
}
/* Setting button */
settingBt.onclick = () => {
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