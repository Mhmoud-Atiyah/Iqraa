const path = require('path');
const fs = require('fs');

//---------------------------------------------------------
// Files Manipulation Routines
//---------------------------------------------------------
/**
 * @brief Reads a file asynchronously.
 * @param {string} filename - The path of the file to read.
 * @returns {Promise<Buffer|string>} A promise that resolves with the file data as a Buffer or string, depending on the encoding used.
 */
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
/**
 * @brief Copies a file from the source path to the destination path.
 *
 * This function uses the Node.js fs.copyFile method to copy a file from the
 * specified source path to the specified destination path. It logs a message
 * indicating whether the file was copied successfully or if an error occurred.
 *
 * @param[in] source The path to the source file.
 * @param[in] destination The path to the destination file.
 */
function copyFile(source, destination) {
    fs.copyFile(source, destination, (err) => {
        if (err) {
            console.error('Error copying the file:', err);
        } else {
            console.log(`File ${source} copied to ${destination} successfully`);
        }
    });
}
/**
* Reads a JSON file and sends its contents as a response in an HTTP server.
*
* @param {string} file - The path to the JSON file to be read.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
*/
function readJson(file, req, res) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err;
        let Data = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(Data));
        res.end();
    });
}
/**
 * Edits a JSON file by either deleting a specified key data or editing existing data.
 *
 * @param {string} path - The path to the JSON file.
 * @param {number} opt - The option for editing the JSON data. 
 * Use 0 to delete data with a string key, 
 * or 1 to edit data with an object, 
 * or 2 to append data to object.
 * @param {string|object} data - The data to be deleted, edited or append . 
 * If `opt` is 0, it should be a string representing the key to be deleted.
 * If `opt` is 1, it should be an object containing the key-value pairs to be edited.
 * If `opt` is 2, it should be an object containing the key-value pairs to be appended
 * @returns {void}
 */
function editJsonFile(path, opt, data) {
    fs.readFileAsync(path).then((seed) => {
        let Input = JSON.parse(seed);
        // Delete Specified Key Data
        if (opt === 0 && typeof data === 'string') {
            if (Input.hasOwnProperty(`${data}`)) {
                delete Input[`${data}`]
            }
        } else if (opt === 1 && typeof data === 'object') {
            // Edit Data
            Input[data[0]] = data[1];
        } else if (opt === 2 && typeof data === 'object') {
            // append Data
            Input.push(data);
        } else {
            // Error Option
            console.log("Invalid option. Use 0 with a string or 1 with an object.");
            return;
        }
        // Write it back
        fs.writeFile(path, JSON.stringify(Input), 'utf8', (err) => {
            if (err) throw err;
            console.log(`Data of file:${path} updated successfully`);
        });
    });
}
/**
* Reads a CSS file and sends its contents as a response in an HTTP server.
*
* @param {string} file - The path to the CSS file to be read.
* @param {Object} req - The HTTP request object.
* @param {Object} res - The HTTP response object.
*/
function readCSS(file, req, res) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        };
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
    });
}
module.exports = {
    copyFile,
    readJson,
    editJsonFile,
    readCSS
};