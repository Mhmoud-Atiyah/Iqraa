//---------------------------------------------------------
// Main Routines
//---------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createLoginWindow } = require('./front');
const { favouriteSave, idUsed, generateUniqueId } = require('./misc');
const { generateHash, encrypt } = require("./encryption")
const { InsertToMyTable, InsertToBooksTable, getRecord, setRecord, createToDatabases } = require('./sqlite');
const { getCover, getAbout } = require('./bookData');
const { readJson, editJsonFile, readCSS } = require('./files');
const { ASSETSPATH, DATAPATH, USERSPATH } = require('./config');
const { checkOnline } = require("./connection");
// SOME SPEICAL DEFINE
const max = 1000000; // maximum number of users
const min = 1;// minimum number of users

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
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        req.on('end', () => {
            try {
                /* Get credentials */
                const { username, password } = JSON.parse(body);
                var record;
                if (password.includes("|||")) { // hashed from local storage
                    // TODO: Need Solution to Avoid SQL Injection
                    record = `SELECT * FROM users WHERE account = "${username}" AND pass = "${password.split("|||")[1]}";`;
                } else {
                    record = `SELECT * FROM users WHERE account = "${username}" AND pass = "${generateHash(password)}";`;
                }
                /* If User Exist ? */
                getRecord(record).then(userData => {
                    if (userData.length > 2) { // User Exist
                        const Id = JSON.parse(userData)[0].id;
                        const Profile = JSON.parse(userData)[0].profile;
                        const EncryptedPass = JSON.parse(userData)[0].pass;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({
                            id: Id,
                            profile: Profile,
                            encryptedPass: EncryptedPass
                        }));
                        res.end();
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.write(JSON.stringify({ id: false }));
                        res.end();
                    }
                }).catch(err => {
                    console.error('Error:', err);
                })
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error parsing JSON' }));
            }
        });
    } else if (req.url.includes('loadConfig')) { // Load config file
        const id = req.url.split('/loadConfig/')[1];
        readJson(`${USERSPATH}/${id}/config.json`, req, res);
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
        var sqlQuery = `SELECT * FROM ${section}_${id};`;
        var sqlTagQuery = `WITH RECURSIVE split_tags(id, tag, rest) AS (
                            SELECT
                                id,
                                substr(tags || ',', 1, instr(tags || ',', ',') - 1) AS tag,
                                substr(tags || ',', instr(tags || ',', ',') + 1) AS rest
                            FROM
                                ${section}_${id}
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
        const id = decodeURIComponent(query_).split('/')[0];
        const config = decodeURIComponent(query_).split('/')[1].split('|');
        try {
            editJsonFile(`${USERSPATH}/${id}/config.json`, 1, config);
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
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        req.on('end', () => {
            try {
                var {
                    id,
                    firstName,
                    lastName,
                    dob,
                    country,
                    gender,
                    account,
                    profile,
                    password } = JSON.parse(body);
                /* 
                    Add User To Users's Table and Directory 
                */
                var isOnline = false;
                // Check Connection
                (async () => {
                    const online = await checkOnline();
                    if (online) {
                        isOnline = true;
                    } else {
                        isOnline = false;
                    }
                })();
                // TODO: Check if userName Exist
                //  Add User To Users's Table
                setRecord(`
                    INSERT INTO users (id, fName, lName, birth, country, gender, account, profile, pass) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    `${id}`,
                    `${firstName}`,
                    `${lastName}`,
                    `${dob}`,
                    `${country}`,
                    `${gender}`,
                    `${account}`,
                    `${profile}`,
                    `${generateHash(password)}`
                ]).then(result => {
                    console.log(`User[${id}]: inserted successfully`, result);
                }).catch(err => {
                    console.error(`Error inserting User[${id}]:`, err);
                });
                //  Add User To Users's Directory
                fs.mkdir(`${USERSPATH}/${id}`, (err) => {
                    if (err) throw err;
                    console.log(`Directory: ${USERSPATH}/${id} created successfully`);
                    /* Save User's Config Data To File */
                    fs.writeFile(`${USERSPATH}/${id}/config.json`,
                        `{
                            "id": "${id}",
                            "new": "true",
                            "riwaqnew": "true",
                            "librarynew": "true",
                            "firstName": "${firstName}",
                            "lasttName": "${lastName}",
                            "account": "${account}",
                            "profile": "${profile}",
                            "current": {
                                "id": "",
                                "cover": "${ASSETSPATH}/bookCover.jpg",
                                "title": "title"
                            },
                            "lastSearch": [],
                            "connection": "${isOnline}",
                            "mode": "light",
                            "dock": "show",
                            "microphone": "off",
                            "speaker": "off",
                            "camera": "off"
                        }`
                        , (err) => {
                            if (err) {
                                console.error('Error writing to file', err);
                            } else {
                                console.log(`Successfully User ${firstName} ${lastName} Registerd with ID: ${id}`);
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
        /* Re-open Login Window again */
        createLoginWindow();
    } else if (req.url.includes('goodreads')) { // Save Goodreads Data to MyBooks Table
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        req.on('end', () => {
            try {
                const { id, filepath } = JSON.parse(body);
                // Create Read, Want and Suggest Tables for User
                createToDatabases([
                    `CREATE TABLE IF NOT EXISTS read_${id} (
                        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                        cover TEXT,
                        title TEXT,
                        review TEXT,
                        tags TEXT,
                        FOREIGN KEY (id) REFERENCES books(bookID)
                    );`,
                    `CREATE TABLE IF NOT EXISTS want_${id} (
                        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                        cover TEXT,
                        title TEXT,
                        review TEXT,
                        tags TEXT,
                        FOREIGN KEY (id) REFERENCES books(bookID)
                    );`,
                    `CREATE TABLE IF NOT EXISTS suggest_${id} (
                        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                        cover TEXT,
                        title TEXT,
                        review TEXT,
                        tags TEXT,
                        FOREIGN KEY (id) REFERENCES books(bookID)
                    );`,
                    `CREATE TABLE IF NOT EXISTS notes_${id} (
                        notes TEXT,
                        tags TEXT
                    );`
                ]).then(() => {
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
                                    table: `read_${id}`,
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
                                    table: `want_${id}`,
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
                })
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