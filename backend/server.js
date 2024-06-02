//---------------------------------------------------------
// Main Routines
//---------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createLoginWindow } = require('./front');
const { favouriteSave } = require('./misc');
//TODO: Covert fetch method of function send data to server

const { readJson, editJsonFile, readCSS } = require('./files');
const { ASSETSPATH, DATAPATH } = require('./config')
// Main Backend Server
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const filePath = path.join(__dirname, 'static/main.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(content);
            }
        });
    } else if (req.url.includes('login')) { // Login Window
        /* First 
            Get credentials
         */
        const credentials = req.url.split('/login/')[1];
        //TODO: Add Decryption
        const Credentials = decodeURIComponent(credentials);
        const [userName, passWord] = Credentials.split('|');
        /* Second
            Retrieve file of user localy OR test on internet one (Future!)
        */
        fs.readFile(`${DATAPATH}/users.json`, 'utf-8', (err, content) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            try {
                const Users = JSON.parse(content);
                for (const user of Users) {
                    if (user.userName == userName && user.passWord == passWord) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify(user.id));
                        res.end();
                        return;
                    };
                };
                //Error! The User not exist
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(""));
                res.end();

            } catch (parseErr) {
                console.error(`Error parsing JSON File (${DATAPATH}/users.json):`, parseErr);
            }
        });
    } else if (req.url.includes('loadConfig')) { // Load config file
        readJson(`${DATAPATH}/config.json`, req, res);
    } else if (req.url.includes('userData')) { // Load User Data
        /* Get User ID */
        const ID = req.url.split('/userData/')[1];
        readJson(`${DATAPATH}/${ID}/${ID}_data.json`, req, res);
    } else if (req.url.includes('search')) { // Search
        /* Get User ID */
        const query_ = req.url.split('/search/')[1];
        const query = decodeURIComponent(query_).split(" ");
        //TODO: Search Backend Work
        res.write(JSON.stringify(
            {
                "Success": "1",
                "result": "Ok!"
            }));
        res.end();
    } else if (req.url.includes('loadUserSection')) { // Load User's Section Data
        const query_ = req.url.split('/loadUserSection/')[1];
        const [id, section] = decodeURIComponent(query_).split('|');
        readJson(`${DATAPATH}/${id}/${id}_${section}.json`, req, res);
    } else if (req.url.includes('loadStyle')) { // Load Style file
        const style = req.url.split('/loadStyle/')[1];
        try {
            readCSS(`${DATAPATH}/themes/${style}.css`, req, res);
        } catch (parseErr) {
            console.error(`Error Load Theme File ${DATAPATH}/themes/${style}.css):`, parseErr);
        }
    } else if (req.url.includes('loadBookData')) { // Load User Data
        /* Get Book ID */
        const ID = req.url.split('/loadBookData/')[1];
        readJson(`${DATAPATH}/books/${ID}.json`, req, res);
    } else if (req.url.includes('editConfig')) { // Edit Config Key
        const query_ = req.url.split('/editConfig/')[1];
        const config = decodeURIComponent(query_).split('|');
        try {
            editJsonFile(`${DATAPATH}/config.json`, 1, config);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(true));
            res.end();
        } catch (parseErr) {
            console.error(`Error Editing JSON File (${DATAPATH}/config.json):`, parseErr);
        }
    } else if (req.url.includes('signUp')) { // signUp Window
        /* 
            Just one time load data for sign up
        */
        fs.readFile(`${ASSETSPATH}/signUp.json`, 'utf-8', (err, content) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
            const signUpData = JSON.parse(content);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(signUpData));
            res.end();
        });
    } else if (req.url.includes('createUser')) { // Save User to File
        const user_Data = req.url.split('/createUser/')[1];
        //TODO: Add Decryption
        const UserData = decodeURIComponent(user_Data);
        let [
            id,
            firstName,
            lasttName,
            age,
            Country,
            gender,
            account,
            profile,
            password,
            about,
            favouriteBooks,
            interests
        ] = UserData.split('|');
        /*
            Create Dir with ID to contain user data and Caches
        */
        fs.mkdir(`${DATAPATH}/${id.slice(4)}`, (err) => {
            if (err) throw err;
            console.log(`Directory: ${DATAPATH}/${id} created successfully`);
            /* Save Main Data To File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}.json`, `
        {
            "id": "${id.slice(4)}",
            "firstName": "${firstName.slice(4)}",
            "lasttName": "${lasttName.slice(4)}",
            "age": "${age.slice(4)}",
            "Country": "${Country.slice(4)}",
            "gender": "${gender.slice(4)}",
            "account": "${account.slice(4)}",
            "profile": "${profile.slice(4)}",
            "password": "${password.slice(4)}",
            "about": "${about.slice(4)}",
            "favouriteBooks": ${favouriteSave(favouriteBooks)},
            "interests": ${favouriteSave(interests)}
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)} Registerd with ID: ${id.slice(4)}`);
                }
            });
            /* Save Minor Data To File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_data.json`, `
        {
            "id": "${id.slice(4)}",
            "new": "true",
            "firstName": "${firstName.slice(4)}",
            "lasttName": "${lasttName.slice(4)}",
            "account": "${account.slice(4)}",
            "profile": "${profile.slice(4)}",
            "current": {
                "id": "",
                "cover": "${ASSETSPATH}/bookCover.jpg",
                "title": "اختر كتاب تقراءه حالياَ"
            },
            "lastSearch": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Minor Data Created`);
                }
            });
            /* Create Read File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_read.json`, `
        {
            "id": "${id.slice(4)}",
            "tags": [],
            "books": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Read Books Created`);
                }
            });
            /* Create Want File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_want.json`, `
        {
            "id": "${id.slice(4)}",
            "tags": [],
            "books": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Wanted Books Created`);
                }
            });
            /* Create Suggest File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_suggest.json`, `
        {
            "id": "${id.slice(4)}",
            "tags": [],
            "books": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s Siggested Books Created`);
                }
            });
            /* Create notes File */
            fs.writeFile(`${DATAPATH}/${id.slice(4)}/${id.slice(4)}_notes.json`, `
        {
            "id": "${id.slice(4)}",
            "tags": [],
            "notes": []
        }
        `, (err) => {
                if (err) {
                    console.error('Error writing to file', err);
                } else {
                    console.log(`Successfully User ${firstName.slice(4)} ${lasttName.slice(4)}'s notes Created`);
                }
            });
            /*  Add User Entry in Users.json */
            editJsonFile(`${DATAPATH}/users.json`, 2, {
                "id": id.slice(4),
                "userName": account.slice(4),
                "passWord": password.slice(4)
            });
        });
        /*
        Re-open Login Window again
        */
        createLoginWindow();
    } else if (req.url.includes('goodreads')) { // Save Goodreads Data to cache
        const path_ = req.url.split('/goodreads/')[1];
        const ID = decodeURIComponent(path_).split('|')[0];
        const JSONPath = decodeURIComponent(path_).split('|')[1];
        fs.readFile(JSONPath, 'utf8', function (err, data) {
            if (err) throw err;
            let JSONFile = JSON.parse(data);
            for (let index = 0; index < JSONFile.length; index++) {
                let obj = {
                    "id": `${JSONFile[index]["Book Id"]}`,
                    "cover": `${getCover(JSONFile[index]["Title"])}`,
                    "title": `${JSONFile[index]["Title"]}`,
                    "path": `${createBook(JSONFile[index]["Book Id"])}`
                }
                if (JSONFile[index]["Exclusive Shelf"] === "read") {
                    editJsonFile(`${DATAPATH}/${ID}/${ID}_read.json`, 2, obj);
                } else {
                    editJsonFile(`${DATAPATH}/${ID}/${ID}_want.json`, 2, obj);
                }
            }
            // let arr = [
            //     'id', "Book Id",
            //     'title', "Title",
            //     'pathbook', "Function to create file",
            //     'pagesCount', "Number of Pages",
            //     'pubDate', "Year Published",
            //     'Publisher', "Publisher",
            //     'rating', "My Rating",
            //     'authorName', "Author", "Additional Authors",
            //     'tags', "[Bookshelves]",
            //     'comments', "My Review"
            // ]
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write("load data");
            res.end();
        });
    } else {
        // Handle other requests (if any)
        res.writeHead(404);
        res.end('Not Found');
    }
});
module.exports = server;