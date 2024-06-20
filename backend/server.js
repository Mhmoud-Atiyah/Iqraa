//---------------------------------------------------------
// Main Routines
//---------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createLoginWindow } = require('./front');
const { favouriteSave } = require('./misc');
//TODO: Covert fetch method of function send data to server
const { InsertToMyTable, InsertToBooksTable, getRecord } = require('./sqlite');
const { getCover, getAbout } = require('./bookData');
const { readJson, editJsonFile, readCSS } = require('./files');
const { ASSETSPATH, DATAPATH } = require('./config');
const { log } = require('console');
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
        // TODO: SELECT * FROM ${section} --> SELECT * FROM ${section_ID}
        var sqlQuery = `SELECT * FROM ${section};`;
        var sqlTagQuery = `WITH RECURSIVE split_tags(id, tag, rest) AS (
                            SELECT
                                id,
                                substr(tags || ',', 1, instr(tags || ',', ',') - 1) AS tag,
                                substr(tags || ',', instr(tags || ',', ',') + 1) AS rest
                            FROM
                                ${section}
                            WHERE
                                tags <> ''
                            UNION ALL
                            SELECT
                                id,
                                substr(rest, 1, instr(rest, ',') - 1),
                                substr(rest, instr(rest, ',') + 1)
                            FROM
                                split_tags
                            WHERE
                                rest <> ''
                        )
                        SELECT DISTINCT tag
                        FROM split_tags
                            ORDER BY tag;`;
        getRecord(sqlQuery).then(records => {
            getRecord(sqlTagQuery).then(recordsTags => {
                let dataToSend = {
                    books: records,
                    tags: recordsTags
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(dataToSend));
                res.end();
            })
        }).catch(err => {
            console.error('Error:', err);
        })
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
        getRecord(`SELECT * FROM books WHERE bookID = ${ID};`).then(bookData => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(bookData);
            res.end();
        }).catch(err => {
            console.error('Error:', err);
        })
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
            editJsonFile(`${DATAPATH}/config.json`, 1, { "id": `"${id.slice(4)}"` });
            editJsonFile(`${DATAPATH}/config.json`, 1, { "firstName": `"${firstName.slice(4)}"` });
            editJsonFile(`${DATAPATH}/config.json`, 1, { "lasttName": `"${lasttName.slice(4)}"` });
            editJsonFile(`${DATAPATH}/config.json`, 1, { "profile": `"${profile.slice(4)}"` });
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
    } else if (req.url.includes('goodreads')) { // Save Goodreads Data to MyBooks Table
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        req.on('end', () => {
            try {
                // TODO: In near Future Add Data to Table of User like {table: "read_123"}
                const { id, filepath } = JSON.parse(body);
                // read file (filepath) and write it's data to database
                fs.readFile(filepath, 'utf8', function (err, data) {
                    if (err) throw err;
                    let Books = JSON.parse(data);
                    let bookCover, bookAbout;
                    // TODO: Optimize this and Add Spinner while loading with message like "يبدو أنك قارئ نهم"
                    Books.forEach(book => {
                        bookCover = getCover(book["Title"]);
                        bookAbout = getAbout(book["Title"]);
                        // Insert Books To Main Table
                        InsertToBooksTable([
                            book['Book Id'], // bookID
                            book['Title'], // title
                            book['Author'], // author
                            book['My Rating'], // myRating
                            book['Average Rating'], // avgRating
                            book['Publisher'], // publisher
                            book['Number of Pages'], // pagesCount
                            book['Year Published'], // pubDate
                            book['Bookshelves'], // tags
                            bookAbout,
                            bookCover
                        ]);
                        /*
                        Insert Specific Book's Data To My Table (performance!)
                        */
                        if (book['Exclusive Shelf'] === "read") {
                            InsertToMyTable({
                                table: "read",
                                Mydata: [
                                    book['Book Id'], // id
                                    bookCover,
                                    book['Title'], // title
                                    book['My Review'], // review
                                    book['Bookshelves'], // tags
                                ]
                            });
                        } else if (book['Exclusive Shelf'] === "to-read") {
                            InsertToMyTable({
                                table: "want",
                                Mydata: [
                                    book['Book Id'], // id
                                    bookCover,
                                    book['Title'], // title
                                    book['My Review'], // review
                                    book['Bookshelves'], // tags
                                ]
                            });
                        } else {
                            console.log("There Is Nothing To Add");
                        }
                    });
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({}));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error parsing JSON' }));
            }
        });
    } else {
        // Handle other requests (if any)
        res.writeHead(404);
        res.end('Not Found');
    }
});
module.exports = server;