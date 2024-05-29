const fs = require('fs');
const http = require('http');

//---------------------------------------------------------
// Helpful Functions
//---------------------------------------------------------
// True if it's first time
function isItfirstTime(path) {
    if (!fs.existsSync(path)) {
        return true;
    } else {
        false;
    }
};
/**
 * Converts a hyphen-separated string of favorite items into a JSON array string.
 * 
 * @param {string} list - The hyphen-separated string of favorite items.
 * @returns {string} A JSON array string containing the favorite items.
 * 
 * @example
 * const list = "item1-item2-item3";
 * const result = favouriteSave(list);
 * console.log(result); // Output: '["item1", "item2", "item3"]'
 */
function favouriteSave(list) {
    let str = '[';
    const arr = list.split("-");
    arr[0] = arr[0].slice(4);
    // Iterate over the array of items
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        str += `"${element}"`;
        // Add a comma if it's not the last item
        if (index != arr.length - 1) {
            str += ',';
        }
    }
    str += ']';
    // Return the JSON array string
    return str;
};
function checkOnline() {
    return new Promise((resolve) => {
        const options = {
            hostname: 'www.google.com',
            port: 80,
            path: '/',
            timeout: 5000,
        };

        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        req.on('error', () => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.abort();
            resolve(false);
        });

        req.end();
    });
}
/**
 * Checks if a string contains Arabic language characters.
 *
 * @param {string} text - The input string to be checked.
 * @returns {boolean} - Returns true if the string contains Arabic characters, otherwise false.
 */
function isArabic(text) {
    var arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
}
/**
 * Converts a number to its Arabic numeral representation.
 *
 * @param {number} number - The number to convert.
 * @returns {string} The Arabic numeral representation of the number.
 */
function convertToArabicNumeral(number) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const numberString = number.toString();
    let arabicNumber = '';

    for (let i = 0; i < numberString.length; i++) {
        const char = numberString[i];
        if (char === '.') {
            arabicNumber += ',';
        } else {
            const digit = parseInt(char);
            arabicNumber += arabicNumerals[digit];
        }
    }

    return arabicNumber;
}
/* Download Data from Goodreads */
// https://www.goodreads.com/review/import
/* Excel Parsing */
module.exports = {
    isItfirstTime,
    favouriteSave,
    checkOnline,
    isArabic,
    convertToArabicNumeral
};