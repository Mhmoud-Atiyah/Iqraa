const sections = ["read", "want", "suggest"];
function bookCard(parent, bookData) {
    let book = document.createElement("div");
    book.innerHTML =
        `<div class="col cursorBt">
            <div class="card shadow-sm">
                <img src="${bookData.cover}"
                    title="${bookData.title}"
                    data-id="${bookData.id}"
                    class="openBookBt"
                    style="border-top-left-radius: 7px;border-top-right-radius: 7px;" height="255px">
            </div>
        </div>
        `;
    parent.append(book);
}

function showOpt(parent, showOptData) {
    let element = document.createElement("li");
    element.className = "secondry-nav-item cursorBt rounded";
    element.innerText = showOptData;
    parent.append(element)
}

function loadSection(section) {
    getData(`loadUserSection/${ID}|${section}`).then((sectionData) => {
        const books = JSON.parse(sectionData["books"]);
        const tags = JSON.parse(sectionData["tags"]);
        if (books.length == 0) { /* No Books Here */
            return;
        }
        let Div = document.createElement('div');
        let Container = document.createElement('div');
        let Row = document.createElement('div');
        Div.id = "mainChild";
        Div.className = "album py-4";
        Container.className = "container";
        Row.className = "row row-cols-1 row-cols-sm-2 row-cols-md-6 g-2";
        Container.append(Row);
        Div.append(Container);
        mainView.append(Div);
        /* Create Books Elements */
        for (let index = 0; index < books.length; index++) {
            bookCard(Row, books[index]);
        };
        /* Add Click Listener */
        for (let index = 0; index < openBookBt.length; index++) {
            openBookBt[index].onclick = () => {
                window.IPC.openBookWindow(openBookBt[index].getAttribute("data-id"));
            }
        };
        /* Create Books Tags */
        for (let index = 0; index < tags.length; index++) {
            showOpt(showOptions, tags[index].tag);
        }
    })
};

for (let index = 0; index < userSection.length; index++) {
    userSection[index].onclick = () => {
        if (document.getElementById("mainChild")) {
            document.getElementById("mainChild").remove();
            for (let index = 0; index < showOptions.children.length + 1; index++) {
                showOptions.lastChild.remove();
            }
        };
        mainView.setAttribute("data-section", `${sections[index]}`);
        loadSection(sections[index]);
    }
}