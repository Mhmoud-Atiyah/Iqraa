function createLibraryBook(BookData) {
    return `
         <div class="col bookItem rounded openBookBt" data-id="${BookData.id}">
                    <img class="bookCover cursorBt" src="${BookData.src}"
                        alt="${BookData.title}" srcset="" title="${BookData.title}">
                    <span class="bookItemData">
                        <p class="bookItemTitle cursorBt">${BookData.title}</p>
                        <p class="bookItemAuthor cursorBt openAuthorBt">${BookData.author}</p>
                    </span>
                    <span class="bookItemPrice">
                        <span class="bookItemPriceText">${BookData.price}
                            <span class="bookItemPriceTextCurrency">${BookData.currency}</span>
                        </span>
                        <span class="bookItemPriceBt rounded cursorBt"><i class="fa-solid fa-cart-shopping"></i></span>
                    </span>
                </div>
    `;
}

export default function createLibrarySection(SectionTitle, Data) {
    let element =
        `
        <div class="row rowTitle fs-5 cursorBt">
            <div class="col">
                    ${SectionTitle}
                    <i class="fa-solid fa-angle-left me-2"></i>
            </div>
        </div>
        <div class="row">
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        ${createLibraryBook(Data[0])}
        </div>
        `;
    let Div = document.createElement('div');
    Div.className = "container rounded containerBook";
    Div.innerHTML = element;
    mainView.append(Div);
}