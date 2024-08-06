const { exec } = require('child_process');
const fs = require('fs');
const { IQRAACPPPath, CACHEPATH } = require('./config');

function SearchBack(query) {
    return new Promise((resolve, reject) => {
        exec(`${IQRAACPPPath} -search ${query}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
                return;
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

async function Search(query) {
    try {
        await SearchBack(query);
        const filePath = `${CACHEPATH}/search: ${query}.json`;
        return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading ${filePath}: ${err.message}`);
                        reject(err);
                        return;
                    }
                    console.log(`Search of ['${query}'] succeeded`);
                    resolve(data);
                });
            } else {
                reject(new Error(`File ${filePath} does not exist`));
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}

module.exports = {
    Search
}