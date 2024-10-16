const { JSDOM } = require('jsdom');

async function fetchBookIds() {
    const bookIds = [];

    for (let index = 1; index <= 1; index++) {
        const fetch = (await import('node-fetch')).default; // Dynamic import
        const response = await fetch(`https://www.hindawi.org/books/${index}/`);
        const html = await response.text();

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const books = document.getElementsByClassName('bookCover');

        for (let book of books) {
            const id = book.firstElementChild.getAttribute('href').split('/')[2];
            bookIds.push(id);
        }
    }
    return bookIds;
}

async function fetchBookDetails(bookIds) {
    const booksDetails = [];

    for (let id of bookIds) {
        const fetch = (await import('node-fetch')).default; // Dynamic import
        const response = await fetch(`https://www.hindawi.org/books/${id}/`);
        const html = await response.text();

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const name = document.getElementsByClassName('details')[0].firstElementChild.innerText;
        const cover = document.getElementsByClassName('cover')[0].firstElementChild.src;

        booksDetails.push({ name, cover });
    }

    return booksDetails;
}

// Start timer
console.time("FetchBooksTime");

// Fetch book IDs and then fetch their details
fetchBookIds().then(bookIds => {
    console.log(bookIds); // Log the book IDs

    // Fetch details for each book using the obtained IDs
    return fetchBookDetails(bookIds);
}).then(booksDetails => {
    console.log(JSON.stringify(booksDetails, null, 2)); // Log the JSON object

    // End timer
    console.timeEnd("FetchBooksTime");
}).catch(error => {
    console.error('Error fetching book details:', error);

    // End timer in case of an error
    console.timeEnd("FetchBooksTime");
});
