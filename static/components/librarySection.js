/***
 * Options Buttons
 * */
const optionsBts = {
        myLibrary: {
            'edit': "fa-regular fa-pen-to-square",
            'delete': "fa-solid fa-trash-can"
        },
        otherLibrary: {
            'preview': "fa-solid fa-magnifying-glass-chart",
            'borrow': "fa-solid fa-brands fa-readme",
            'purchase': "fa-solid fa-bag-shopping",
        }
    }
;

function createLibraryBook(BookData, paid = true) {
    const LibraryBook = `
         <div href="/bookview?bookId=${BookData.id}" class="bookItem rounded openBookBt mb-3" style="width: 15.4%">
            <!-- Price Flag -->
            <span class="bookItemFlag"></span>
            <!-- Book Cover -->
            <a href="/bookview?bookId=${BookData.id}">
                <img class="bookCover cursorBt rounded-2" src="${BookData.details.coversrc}" alt="${BookData.title}" title="${BookData.details.title}">
            </a>
            <!-- Library Stamp (Optional) -->
            <!--TODO: add this data to inputs -->
            <div>
                <img class="LibraryStamp rounded-circle mt-2" src="assets/libraryEmblem.png" alt="${BookData.title}" title="جميع الحقوق محفوظة ل مؤسسة هنداوي">
            </div>
            <!-- Title and Author -->
            <div class="bookItemData text-center" style="font-family: Omar, serif">
                <a href="/bookview?bookId=${BookData.id}" class="bookItemTitle cursorBt">${BookData.details.title}</a>
                <a href="/author?authorId=${BookData.details.authorid}" class="bookItemAuthor cursorBt openAuthorBt">${BookData.details.authornames[0]}</a>
            </div>
            <!-- Price (Optional) -->
            <div class="bookItemPrice text-center">${BookData.price}<span class="bookItemPriceTextCurrency pe-1"></span></div>
            <!-- Options -->
            <div class="bookItemOptions mt-2 pt-2 container pb-1">
                <ul class="row">
                    <li class="col bookItemOptionBt rounded-2 cursorBt text-center"><i class="${optionsBts.myLibrary.edit}"></i></li>
                    <li class="col bookItemOptionBt rounded-2 cursorBt text-center ${Object.keys(optionsBts.myLibrary)[1]}-bt"><i class="${optionsBts.myLibrary.delete}"></i></li>
                </ul>
            </div>
         </div>
    `;
    return LibraryBook;
}

// TODO: Sections Views
export default function createLibrarySection(SectionTitle, Data) {
    // Sort Sections First
    Data.sort((a, b) => {
        if (a.section < b.section) return -1;
        if (a.section > b.section) return 1;
        return 0;
    });
    // Create View
    let element =
        `
        <div class="row rowTitle">
            <div class="col"> 
             <span>${SectionTitle}</span>
             <i class="fa-solid fa-angle-left me-2"></i>
            </div>
        </div>
        <div class="row">`;
    // Append Books
    for (let i = 0; i < Data.length; i++) {
        element += `${createLibraryBook(Data[i])}`;
    }
    element += `</div>`;
    let Div = document.createElement('div');
    Div.className = "container rounded containerBook mb-3";
    Div.innerHTML = element;
    mainView.append(Div);
}