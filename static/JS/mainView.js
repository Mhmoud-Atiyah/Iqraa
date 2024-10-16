import misc from "./misc.js"
import showHideSecondaryWindow from './SecondaryWindow.js';
import headerTag from "../components/headerTag.js";
import loadSection from "../components/loadSection.js";

const tagId = misc.getQueryParams().tagId || null;

/**********************
 * Main Routine On start
 * ********************/
window.onload = () => {
    document.getElementById("main").style.height = window.innerHeight - 60 + 'px';
    /***
     * Iqraa User
     * */
    if (misc.ID !== null) {
        misc.getData(`loadConfig/${misc.ID}`).then((config) => {
            /***
             * Main Books
             * */
            if (tagId != null) {

            }
            /***
             * Load Tags
             * */
            headerTag(tagsArea, 'to-read', 'أعجبني');
            if (Array.isArray(config.tags)) {
                for (let i = 0; i < config.tags.length; i++) {
                    if (config.tags[i] !== tagId) {
                        headerTag(tagsArea, config.tags[i], config.tags[i]);
                    }
                    // Activate Tag
                    else {
                        headerTag(tagsArea, config.tags[i], config.tags[i], true);
                    }

                }
                // Load Section
                loadSection(tagId);
            }
            /*************
             * Current Book
             * *************/
            if (!config.currentid) {
                misc.getData(`loadBookData/${misc.ID}/${config.currentid}`).then((bookData) => {
                    if (bookData != null) {
                        current.src = bookData.cover;
                        current.title = bookData.title;
                        current.className = "cursorBt openBookBt";
                        current.setAttribute("data-path", config.current.id);
                        current.onclick = () => {
                            if (!misc.isElectron()) {
                                //     TODO:
                            } else {
                                window.IPC.openBookWindow(current.getAttribute("data-path"), misc.ID);
                            }
                        }
                    }
                })
            }
            /**************
             * Default Book
             * ************/
            else {
                current.src = "assets/bookCover.jpg";
                current.title = "غلاف كتاب";
                current.className = "cursorBt";
            }
            /**************
             * Welcome Message
             * ************/
            if (config.newuser) {
                let element = `
                <div class="newSection position-relative overflow-hidden m-md-2 text-center rounded">
                    <div class="col-md-5 p-lg-5 mx-auto" style="letter-spacing: 1px;">
                        <h1 class="text-warning" style="font-family: DecorationFont3,serif;">أنا من بدل بالكتب الصحابا<br> لم أجد لي وافيا إلا الكتابا</h1>
                        <h1 class="display-4 fw-normal">يبدو أنك مستعد</h1>
                        <p class="lead fw-normal fs-3"> لديك خيارات مختلفة لتجميع مكتبتك<br>
                            &nbsp بالبحث عن الكتاب&nbsp أو&nbsp إضافة كتاب يدوي<br> أو&nbspبجلبها من مكان آخر</p>
                        <a class="btn fw-bold fs-4 ms-1 border" style="line-height: 1em;color: var(--App-navTextColor);" href="#" id="browse_file">
                            اختر ملف<i class="fa-solid fa-file-import me-1"></i>
                                    <input class="form-control" type="file" name="file" style="display:none" id="browse_file_input" accept=".json">
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
                        document.getElementsByClassName("newSection")[0].style.filter = "blur(5px)"
                        let loader = document.createElement('span');
                        loader.className = "loader";
                        loader.style.top = "-35%"
                        loader.style.right = "48%"
                        loader.style.zIndex = "1";
                        mainView.append(loader);
                        /* open Counter if time taken bigger than > value say message */
                        // setInterval()
                        /**********
                         * Post File
                         * ********/
                        misc.postForm('goodreads', {
                            userId: misc.ID,
                            hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null
                        }, document.getElementById("browse_file_input").files[0]).then((res) => {
                            if (res) {
                                if (!res.status) {
                                    console.log(res.msg);
                                    // Clear Screen
                                    while (mainView.firstChild) {
                                        mainView.removeChild(mainView.firstChild);
                                    }
                                } else {
                                    console.error(res);
                                }
                            }
                        });
                    };
                }
            }
            /*****
             * Load Effect
             * ****/
            document.getElementsByClassName('loader')[0].remove();
            mainView.style.filter = "blur(0)";
        })
    }
    /***
     * Internet User
     * */
    else {
        current.src = "assets/bookCover.jpg";
        current.title = "غلاف كتاب";
        current.className = "cursorBt";
        // TODO: Create Iqraa Welcome Window
    }
}
/***
 * My Books
 * */
myBooks.onclick = () => {
    if (document.getElementById("mainChild")) {
        document.getElementById("mainChild").remove();
    }
    // Set Current
    mainView.setAttribute("data-section", `read`);
    // Load Screen
    loadSection('read');
}
/***********
 * Open Book
 * ********/
for (let index = 0; index < openBookBt.length; index++) {
    openBookBt[index].onclick = () => {
        if (!misc.isElectron()) {
            /*TODO: Open Book view*/
            window.location.href = `https://${misc.DOMAIN}/bookview?userId=${misc.ID}&bookId=${openBookBt[i].getAttribute("data-id")}`;
        } else {
            window.IPC.openBookWindow(openBookBt[index].getAttribute("data-path"), misc.ID);
        }
    }
}
/****************
 * Setting button
 * **************/
settingBt.onclick = () => {
    /*TODO: Set it right and responsive */
    showHideSecondaryWindow('الإعدادات', 'تظبيط شوية حاجات في الاعدادات', 'تمام');
}
/****************
 * Library button
 * **************/
libraryBt.onclick = () => {
    if (!misc.isElectron()) {
        window.location.href = `/library`;
    } else {
        window.IPC.openLibraryWindow(misc.ID);
    }
}
/*************
 * Riwaq button
 * ************/
riwaqBt.onclick = () => {
    if (!misc.isElectron()) {
        window.location.href = `/riwaq`;
    } else {
        window.IPC.openRiwaqWindow(misc.ID);
    }
}