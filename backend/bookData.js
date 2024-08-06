const { exec } = require('child_process');
const fs = require('fs').promises;
const { DATAPATH, CACHEPATH } = require('./config');
const IQRAACPPPath = DATAPATH + '/iqraa';

fs.readFileAsync = function (filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

function fetchBookData(bookId) {
    return new Promise((resolve, reject) => {
        exec(`${IQRAACPPPath} -open ${bookId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${stderr}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`Output: ${stdout}`);
            resolve(stdout);
        });
    });
}

// This Function Retrive Data from Goodreads and save it
// to cache file temporary until write it to Database
async function getBookData(bookID) {
    const filePath = `${CACHEPATH}/${bookID}.json`;
    // Check if file exists
    try {
        await fs.access(filePath);
        const seed = await fs.readFile(filePath, 'utf-8');
        const bookData = JSON.parse(seed);
        return bookData;
    } catch (err) {
        const Data = await fetchBookData(bookID);
        try {
            const seed = await fs.readFile(filePath, 'utf-8');
            const bookDataFromFile = JSON.parse(seed);
            return bookDataFromFile;
        } catch (parseError) {
            console.error(parseError);
        }
        return Data;
    }
}

async function downloadBookData(bookID) {
    const filePath = `${CACHEPATH}/${bookID}.json`;
    // Check if file exists
    try {
        await fs.access(filePath);
        return;
    } catch (err) {
        const Data = await fetchBookData(bookID);
        console.log(`Book With Id [${ID}] Retrieved From Goodreads`);
    }
}

function createBook(id) {
    fs.writeFile(`${DATAPATH}/books/${id}.json`, `[]`, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log(`Book of Id[${id}] File Created`);
        }
    });
}

module.exports = {
    createBook,
    getBookData,
    downloadBookData
}