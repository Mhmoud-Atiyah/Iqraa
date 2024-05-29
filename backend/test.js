const axios = require('axios');
const cheerio = require('cheerio');

// URL of the webpage to parse
const url = 'https://www.goodreads.com/book/show/6177882';

// Fetch the webpage content
axios.get(url)
    .then(response => {
        // Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // Example: Extract all links from the webpage
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            console.log(link);
        });

        // Example: Extract the text content of a specific element
        const title = $('title').text();
        console.log('Title:', title);

    })
    .catch(error => {
        console.error('Error fetching/parsing the webpage:', error);
    });
