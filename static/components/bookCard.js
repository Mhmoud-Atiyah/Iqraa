export default function bookCard(parent, bookData) {
    let book = document.createElement("div");
    book.innerHTML =
        `<a class="col cursorBt" href="/bookview?bookId=${bookData.bookId}">
            <div class="card shadow-sm">
                <img src="${bookData.bookCover}"
                    title="${bookData.title}"
                    data-id="${bookData.bookId}"
                    class="openBookBt"
                    style="border-top-left-radius: 7px;border-top-right-radius: 7px;" height="255px">
            </div>
        </a>
        `;
    parent.append(book);
}