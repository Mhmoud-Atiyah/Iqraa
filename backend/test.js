const axios = require('axios');
const cheerio = require('cheerio');

// URL of the webpage to parse
const url = 'https://www.goodreads.com/book/show/6177882';

// Fetch the webpage content
axios.get(url)
    .then(response => {
        // Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);

        const ID = 1232;//TODO:
        // const cover = $('.ResponsiveImage[role="presentation"]');
        const title = $('.Text__title1').text();
        const PC = $('[data-testid="pagesFormat"]').text();
        // const PD = $('.').text();
        // const rate = $('.').text();
        // const author = $('.').text();//TODO: convert name to ID in DB
        // const about = $('.').text();
        // const tags = $('.').text();

        // console.log('Cover:', cover);
        console.log('Title:', title);
        console.log('PC:', PC);

    })
    .catch(error => {
        console.error('Error fetching/parsing the webpage:', error);
    });
