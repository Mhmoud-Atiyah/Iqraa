
function createLibraryBook(BookData) {
    return `
         <a href="/bookview?bookId=${BookData.id}" class="bookItem rounded openBookBt mb-3" data-id="${BookData.id}" style="width: 15.4%">
                    <img class="bookCover cursorBt" src="${BookData.details.coversrc}"
                        alt="${BookData.title}" srcset="" title="${BookData.details.title}">
                    <span class="bookItemData">
                        <p class="bookItemTitle cursorBt">${BookData.details.title}</p>
                        <p class="bookItemAuthor cursorBt openAuthorBt">${BookData.details.authorid}</p>
                    </span>
                    <span class="bookItemPrice">
                        <span class="bookItemPriceText">${BookData.price}
                            <span class="bookItemPriceTextCurrency"></span>
                        </span>
                        <span class="bookItemPriceBt rounded cursorBt"><i class="fa-solid fa-cart-shopping"></i></span>
                    </span>
                </a>
    `;
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
        <div class="row rowTitle cursorBt">
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