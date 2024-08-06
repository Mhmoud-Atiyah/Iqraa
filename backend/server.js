//---------------------------------------------------------
// Main Routines
//---------------------------------------------------------
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createLoginWindow } = require('./front');
const { generateUniqueRandomNumber } = require('./misc');
const { generateHash } = require("./encryption")
const { InsertToMyTable, InsertToBooksTable, getRecord, setRecord, createToDatabases, checkExist } = require('./sqlite');
const { getCover, getAbout, getBookData } = require('./bookData');
const { readJson, editJsonFile, readCSS } = require('./files');
const { ASSETSPATH, DATAPATH, USERSPATH, CACHEPATH } = require('./config');
const { checkOnline } = require("./connection");
const { Search } = require("./searchEngine");
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
        const query = decodeURIComponent(query_);
        /*TODO: Search Local Databse */
        /* checkExist("books", "title", `${query}`, (err, exist) => {
            if (err) {
                console.error('Error:', err);
            } else if (exist) {
                getRecord(`SELECT * FROM books WHERE title = "${query}";`).then(bookData => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(bookData);
                    res.end();
                }).catch(err => {
                    console.error('Error:', err);
                })
                return;
            } else {
                console.log(`Query does not exist in table books.`);
            }
        }); */
        /* Check Cache then Goodreads */
        if (fs.existsSync(CACHEPATH + `/search: ${query}.json`)) { /* Check Cache First */
            readJson(CACHEPATH + `/search: ${query}.json`, req, res);
        } else { /* Search Goodreads */
            /* Do Search */
            (async () => {
                try {
                    const querys = await Search(query);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify(querys));
                    res.end();
                } catch (error) {
                    console.error(`Error in Search [${query}]:`, error);
                }
            })();
        }
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
        /* Check if book Cached From Search (do it first for performance) */
        if (fs.existsSync(CACHEPATH + `/${ID}.json`)) {
            // response to User
            readJson(CACHEPATH + `/${ID}.json`, req, res);
            // Write Data To Database
            fs.readFile(CACHEPATH + `/${ID}.json`, 'utf8', function (err, data) {
                if (err) throw err;
                let Data = JSON.parse(data);
                setRecord(`
                    INSERT INTO books (bookID, title, author, myRating,	avgRating, publisher, pagesCount, pubDate, tags, about, coverSrc, readCount) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    `${Data.id}`,
                    `${Data.title}`,
                    `${Data.author.name}`,
                    `0`,
                    `${Data.rating}`,
                    `مكتبة`,//TODO: Get it in c++
                    `${Data.pagesCount}`,
                    `${Data.pubDate}`,
                    `${Data.tags.join("")}`,
                    `${Data.about}`,
                    `${Data.coverSrc}`,
                    `1`
                ]).then(result => {
                    // Delete json File
                    fs.unlink(CACHEPATH + `/${ID}.json`, (err) => {
                        if (err) {
                            console.error('Error removing file:', err);
                            return;
                        }
                        console.log(`Book[${Data.title}]: inserted successfully`, result);
                    });
                }).catch(err => {
                    console.error(`Error inserting Book[${title}]:`, err);
                });
            })
        } else { // Get Data from Database
            getRecord(`SELECT * FROM books WHERE bookID = ${ID};`).then(bookData => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(bookData);
                res.end();
            }).catch(err => {
                console.error('Error:', err);
            })
        }
    } else if (req.url.includes('downloadBookData')) { // Download Book's Data from Goodreads
        /* Get Book ID */
        const ID = req.url.split('/downloadBookData/')[1];
        /* Use IQraa To Download Data Using ID of Book */
        getBookData(ID).then((obj) => {
            console.log(`Book With Id [${ID}] Retrieved From Goodreads`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({}));
            res.end();
        }).catch((err) => {
            console.error(err);
        });
    } else if (req.url.includes('editConfig')) { // Edit Config Key
        const query_ = req.url.split('/editConfig/')[1];
        const id = decodeURIComponent(query_).split('/')[0];
        const config = decodeURIComponent(query_).slice(query_.indexOf("/") + 1).split('|');
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
    } else if (req.url.includes('addbook')) { // Add New Book From outside The Database
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString(); // Accumulate incoming data chunks
        });
        req.on('end', () => {
            try {
                const { bookCover, bookName, bookAuthor, bookPC, bookPubDate, bookPublisher, bookRating, bookAbout } = JSON.parse(body);
                //TODO: on input if Name exist in DB then Just Redirect to Book Page
                InsertToBooksTable([
                    generateUniqueRandomNumber(), // bookID
                    bookName, // title
                    bookAuthor, // author
                    bookRating, // myRating
                    "1", // avgRating
                    bookPublisher, // publisher
                    bookPC, // pagesCount
                    bookPubDate, // pubDate
                    bookAbout,
                    bookCover
                ])
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