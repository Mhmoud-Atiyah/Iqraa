const browse_coverBt = document.getElementById("browse_cover");
const download_coverBt = document.getElementById("download_cover");
const browse_cover = document.getElementById("browse_cover_input");
const bookCoverImg = document.getElementById("bookCover");
const BookName = document.getElementById("BookName");
const BookAuthor = document.getElementById("BookAuthor");
const BookPC = document.getElementById("BookPagesCount");
const BookPubDate = document.getElementById("BookPubDate");
const bookAbout = document.getElementById("bookAbout");
const Tags = document.getElementsByClassName("tag");
const ratingBts = document.getElementsByClassName("ratingBt");
const addBookBt = document.getElementById("addBookBt");
const alertPlaceholder = document.getElementById("alertPlaceholder");

/* Global Vars */
var coverPath;
var Rating = 0;
var tags = [];

function Alert(Placeholder, level, msg) {
    const alertDiv = document.createElement('div');
    if (level === "error") {
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    } else {
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
    }
    alertDiv.setAttribute('data-mdb-position', 'bottom-center');
    alertDiv.role = 'alert';
    alertDiv.style.position = "fixed";
    alertDiv.style.bottom = "0px";
    alertDiv.style.left = "30%";
    alertDiv.style.wordSpacing = "2px";
    alertDiv.innerHTML = `<span style="font-size:24px">${msg}</span>`;
    Placeholder.appendChild(alertDiv);
    // Remove the alert after a few seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('hide');
        alertDiv.addEventListener('transitionend', () => alertDiv.remove());
    }, 3000);
}
//TODO: Load all Current User Tags for tags suggest
window.onload = () => {
    getData("loadConfig").then((config) => { // Global Config
        /* Dark mode setting */
        if (config.mode === "dark") { // Now is Dark
            loadTheme("darkTheme");
        } else {    // Now is Light
            loadTheme("lightTheme");
        }
    })

}
/* Book Name Input */
//TODO: on input if Name exist in DB then Just Redirect to Book Page
BookName.oninput = () => {

}
// Cover Browse Button
browse_coverBt.onclick = () => {
    document.getElementById("browse_cover_input").click();
}
browse_cover.oninput = () => {
    if (document.getElementById("browse_cover_input").value != "") {
        coverPath = document.getElementById("browse_cover_input").files[0].path;
        bookCoverImg.src = document.getElementById("browse_cover_input").files[0].path;
        bookCoverImg.style.filter = "";
    }
}
// Cover Download Button
download_coverBt.onclick = () => {
    if (BookName.value != "") {
        //TODO: Retrieve Cover by name
    } else {
        BookName.style.border = "solid 1px red";
        BookName.placeholder = "اكتب اسم الكتاب اولاً ليتم البحث"
        setTimeout(() => {
            BookName.style.border = "";
            BookName.placeholder = "اسم الكتاب"
        }, 3000);
    }
}
// bookPageCount Button
BookPC.oninput = () => {
    if (BookPC.value.length > 4) {
        BookPC.style.border = "solid 1px red";
        setTimeout(() => {
            BookPC.style.border = "";
        }, 2000);
    };
}
// PubDate Button
BookPubDate.oninput = () => {
    if (BookPubDate.value.length > 4 ||
        BookPubDate.value > 2025) {
        BookPubDate.style.border = "solid 1px red";
        setTimeout(() => {
            BookPubDate.style.border = "";
        }, 2000);
    };
}
// Rating Buttons
for (let index = 0; index < ratingBts.length; index++) {
    ratingBts[index].onclick = () => {
        Rating = 5 - index;
    }
}
for (let index = 0; index < Tags.length; index++) {
    Tags[index].oninput = () => {
        if (Tags[index].value.includes(" ")) {
            Tags[index].style.border = "solid 1px red";
            setTimeout(() => {
                Tags[index].style.border = "";
            }, 2000);
        }
    }
}

// addBookBt
addBookBt.onclick = () => {
    if (BookName.value === "" ||
        BookAuthor.value === "" ||
        BookPC.value === "" ||
        BookPC.value.length > 4 ||
        BookPubDate.value === "" ||
        BookPubDate.value.length > 4 ||
        bookAbout.value === ""
    ) {
        Alert(alertPlaceholder, "error", "اكتب البيانات المطلوبة أولاً وبشكل صحيح");
        let requiredElements = document.getElementsByClassName("required");
        for (let index = 0; index < requiredElements.length; index++) {
            if (requiredElements[index].value === "") {
                requiredElements[index].style.border = "solid 1px red";
            };
        }
        setTimeout(() => {
            for (let index = 0; index < requiredElements.length; index++) {
                if (requiredElements[index].value === "") {
                    requiredElements[index].style.border = "";
                };
            }
        }, 3000);
        return;
    } else {
        /* Check Cover Exist ? */
        if (bookCoverImg.src != "") {
            bookCoverImg.src = "assets/bookCover.jpg"
        };
        /* Tags Inputs */
        for (let index = 0; index < Tags.length; index++) {
            if (Tags[index].value != "") {
                tags.push(Tags[index].value);
            }
        }
        // POST data to Server
        fetch('http://localhost:1999/createBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BookCover_: bookCoverImg.src.replace("file://", ""),
                BookName_: BookName.value,
                BookAuthor_: BookAuthor.value,
                BookPC_: BookPC.value,
                BookPubDate_: BookPubDate.value,
                BookRating: Rating,
                BookAbout_: bookAbout.value,
                BookTags: tags
            })
        }).then(response => response.text()).then(data => {
            window.alert("تم تسجيل الكتاب بنجاح");
            window.close();
        }).catch((error) => {
            console.error('Error:', error);
        });

    }
}
