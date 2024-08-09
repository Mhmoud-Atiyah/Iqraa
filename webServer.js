const express = require('express');
const https = require('https');
const fs = require('fs');
const pool = require('./backend/pg');
const path = require('path');
const multer = require('multer');
const {generateHash} = require("./backend/encryption");
const stylePath = path.join(__dirname, "static/style")
const {ASSETSPATH} = require('./backend/config');
const pg = require('./backend/pg');
const {getCover, getAbout} = require("./backend/bookData");
const {checkUserCredentials} = require("./backend/pg");
const app = express();
const port = 443; // Default HTTPS port
const maximumRetrievedQueries = 4;

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/cache/'); // Define the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

// SSL certificate
const options = {
    key: fs.readFileSync(path.join(__dirname, "certs", 'iqraa.key')),
    cert: fs.readFileSync(path.join(__dirname, "certs", 'iqraa.crt'))
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    //TODO: on load https://iqraa.com redirect to page where to check user cred from localstorage
    res.send('Hello World!');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "login.html"));
});

app.get('/countryList', (req, res) => {
    /* Just one time load data for sign up */
    fs.readFile(`${ASSETSPATH}/countryList.json`, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
            // Send JSON data as response
            res.json(jsonData);
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/login', (req, res) => {
    try {
        /* Get credentials */
        const {username, password} = req.body;
        let pass = ``;
        // hashed from local storage
        password.includes("|||") ? pass = password.split("|||")[1] : pass = generateHash(password);
        /* If User Exist ? */
        (async () => {
            try {
                const exists = await pg.checkUserCredentials(username, pass);
                if (exists != null) {
                    console.log(`Welcome Back ${username}`);
                    /* Get Needed Data From Record */
                    pg.getRecord("users", Number(exists)).then(data => {
                        res.send(data);
                    });
                } else {
                    console.log('Invalid credentials');
                }
                /* Get Needed Data from Record */
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/iqraa', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "main.html"));
})

app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "library.html"));
})

app.get('/riwaq', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "riwaq.html"));
})

app.post('/initSession', (req, res) => {
    try {
        /* Get credentials */
        const {userId, hashedPass, sessionTitle} = req.body;
        let pass = ``;
        /* If User Exist ? */
        (async () => {
            try {
                const exists = await pg.getRecord("users", userId);
                if (exists != null) {
                    /* Check Password */
                    if (hashedPass === exists.pass) {
                        /* TODO: Init Session */
                        const sessionID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
                        pg.insertData("riwaq", {
                            sessionid: sessionID,
                            adminid: userId
                        }).then();
                        res.send(`${sessionID}`);
                        //TODO: res.redirect(`/riwaq?userId=${userId}&sessionId=${sessionID}`);
                        console.log(`${sessionTitle} created`);
                    } else {
                        console.log(`User [${userId}] Not Authorized`);
                    }
                } else {
                    console.log(`User [${userId}] Not Found`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/joinSession', (req, res) => {
    try {
        /* Get credentials */
        const {userId, hashedPass, sessionId} = req.body;
        /* If User Exist ? */
        (async () => {
            try {
                const exists = await pg.getRecord("users", userId);
                if (exists != null) {
                    /* Check Password */
                    if (hashedPass === exists.pass) {
                        /* TODO: Join Session */
                        /* Ask Session Admin For Permission */

                    } else {
                        console.log(`User [${userId}] Not Authorized`);
                    }
                } else {
                    console.log(`User [${userId}] Not Found`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/loadStyle/:themeName', (req, res) => {
    const theme = req.params.themeName;
    try {
        fs.readFile(`${stylePath}/${theme}.css`, 'utf8', function (err, data) {
            if (err) {
                res.status(500).send('Internal Server Error');
                return;
            }
            res.send(data);
        });
    } catch (parseErr) {
        console.error(`Error Load Theme File ${__dirname}/${theme}.css):`, parseErr);
    }
});

app.get('/loadConfig/:userId', (req, res) => {
    const id = req.params.userId;
    /* Get Needed Data From Record */
    pg.getRecord("users", Number(id)).then(data => {
        res.send(data);
    });
});

app.get('/loadBookData/:userId/:bookId', (req, res) => {
    const userID = req.params.userId;
    const bookID = req.params.bookId;
    /* Get Needed Data From Record */
    pg.getRecord(`user_${userID}`, Number(bookID)).then(data1 => {
        pg.getRecord(`books`, Number(bookID)).then(data2 => {
            const authorID = data2.authorid;
            pg.getRecord(`authors`, Number(authorID)).then(data3 => {
                res.json({...data1, ...data2, author: data3})
            })
        });
    });
});

app.get('/loadUserSection/:userId/:Section', (req, res) => {
    const id = req.params.userId;
    const section = req.params.Section;//TODO: get data based on section also
    /* Get Data From User Database */
    pg.loadMainView(id, section).then(books => {
        // Send it To user
        res.json(books);
    });
})

app.post('/goodreads/:userId', upload.single('file'), (req, res) => {
    const id = req.params.userId;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const dataPath = req.file.path;
    /* Write Data To Database */
    pg.createTable(`user_${id}`,
        'id INTEGER PRIMARY KEY NOT NULL UNIQUE,' +
        'reviewId INTEGER NOT NULL UNIQUE,' +
        'dateRead DATE,' +
        'dateAdd DATE,' +
        'bookshelf TEXT,' +
        'bookShelves TEXT[],' +
        'myRate DOUBLE PRECISION,' +
        'FOREIGN KEY (id) REFERENCES books(id)'
    ).then(() => {
        /* Create Reviews Table */
        /*TODO: add goodreads Reviews below */
        pg.createTable(`review_${id}`,
            'bookId INTEGER NOT NULL,' +
            'review TEXT,' +
            'threadId INTEGER,' +
            'dateReview TIMESTAMP,' +
            'likesCount INTEGER,' +
            `FOREIGN KEY (bookId) REFERENCES user_${id}(id)`
        ).then(() => {
            /* Open Uploaded File To Read */
            fs.readFile(dataPath, 'utf8', function (err, data) {
                if (err) throw err;
                let books = JSON.parse(data);
                /* Insert Data to Tables */
                let bookCover, bookAbout, exist = 0;
                let temp = 0;
                //TODO: For Future if I create My DB this step will be deleted
                /*TODO: think about if the client himself do all this staff and give me prepared json file*/
                books.forEach(book => {
                    /* check if Book Exist */
                    (async () => {
                        exist = await pg.checkIfIdExists("books", book["Book Id"]);
                        /* Add Book To Main Books Database */
                        if (!exist) {
                            bookCover = "https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg";
                            bookAbout = "book about";
                            await pg.insertData(`books`, {
                                id: book["Book Id"],
                                title: book['Title'],
                                avgrating: book['Average Rating'],
                                authorid: 1,//TODO: assign author name to id
                                coversrc: bookCover, //TODO: do it work
                                isbn: "ISBN",//TODO: Check
                                publisher: book['Publisher'],
                                pagescount: book['Number of Pages'],
                                readcount: 1234,
                                //TODO: pubdate: book['Original Publication Year'] > 0 ? book['Original Publication Year'] : book['Year Published'],
                                pubdate: book['Year Published'],
                                about: bookAbout,// TODO: do it work
                                tags: book['Bookshelves'].split(",")
                            }).then(res => {
                                console.log(`Book [${book['Title']}] added with Id [${book['Book Id']}]`);
                            }).catch(err => console.error('Error inserting data:', err));
                        }
                        /* Add Book To User's Books Database */
                        await pg.insertData(`user_${id}`, {
                            id: book["Book Id"],
                            reviewId: book["Book Id"],//TODO: do it
                            dateRead: (book['Date Read'] === "" ? new Date("1970") : new Date(book['Date Read'])),
                            dateAdd: (book['Date Added'] === "" ? new Date("1970") : new Date(book['Date Added'])),
                            bookshelf: book['Exclusive Shelf'],
                            bookShelves: book["Bookshelves"].split(","),
                            myRate: book['My Rating']
                        });
                    })();
                });
            });
            /* Remove File From Cache After Read */
            fs.unlink(dataPath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                }
            });
        });
    });
    /* Go back to Main Again */
    res.redirect(`/iqraa?userId=${id}`);
});

app.get('/bookview', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "bookView.html"));
})

app.post('/addToMyBooks', (req, res) => {
    try {
        /* Get credentials */
        const {bookId, userId, hashedPass, data} = req.body;
        pg.getRecord("users", userId).then(credentials => {
            if (credentials != null) {
                /* Check Credentials*/
                if (hashedPass === credentials.pass) {
                    (async () => {
                        try {
                            /* Check Existence in user table */
                            const exists = await pg.checkIfIdExists(`user_${userId}`, bookId);
                            if (!exists) {// never Added to table before
                                pg.insertData(`user_${userId}`, {
                                    id: bookId,
                                    reviewId: userId,//TODO: create database relation for this
                                    dateRead: data[0],
                                    dateAdd: data[1],
                                    bookshelf: data[2],
                                    bookShelves: data[3],
                                    myRate: data[4]
                                }).then(() => {
                                        console.log(`Book of id [${bookId}] added to user [${userId}] table`);
                                        res.send(`Book of id [${bookId}] added to user [${userId}] table`)
                                    }
                                );
                            } else {
                                /* Check if bookshelves contain same bookshelf in request */
                                pg.getRecord(`user_${userId}`, bookId).then(record => {
                                    /* change bookshelf if needed */
                                    let recordBookshelf;
                                    record.bookshelf === "read" ? recordBookshelf = "to-read" : recordBookshelf = "read";
                                    /* Change BookShelves */
                                    const bookshelves = new Set(record.bookshelves);
                                    let recordBookshelves = record.bookshelves;
                                    /* Check Routine */
                                    data[3].forEach(bookshelf => {
                                        if (!bookshelves.has(bookshelf)) {
                                            recordBookshelves.push(bookshelf);
                                        }
                                    })
                                    /* Write Back */
                                    pg.updateRecord(`user_${userId}`, bookId, "bookshelves", recordBookshelves).then(() => {
                                        pg.updateRecord(`user_${userId}`, bookId, "bookshelf", recordBookshelf).then(() => {
                                            console.log(`Book of id [${bookId}] already exist in user [${userId}] table`);
                                            res.send(`Book of id [${bookId}] already exist in user [${userId}] table`);
                                        });
                                    });
                                });
                            }
                        } catch (error) {
                            res.status(500).send('Internal Server Error');
                        }
                    })();
                } else {// User Not Authorized
                    //    res.send(`You're not Authorized to make this as user [${userId}]`);
                    console.log(`You're not Authorized to make this as user [${userId}]`);
                }
            }
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/search', (req, res) => {
    try {
        /* Get Query */
        const {query} = req.body;
        /* Search Database for Query */
        pg.searchBooks(query).then(response => {
            if (response != null) {
                let books = response.map(obj => {
                    return {...obj, authorName: 'authorName'};
                });
                /* Return only Maximum Retrieved Queries */
                for (let i = 0; i < maximumRetrievedQueries; i++) {
                    /* Check if Retrieved Less maximumRetrievedQueries */
                    if (i === response.length) break;
                    /* Get Author Name Based on id */
                    pg.getRecord("authors", response[i].authorid).then((authorData) => {
                        books[i].authorName = authorData.name;
                    });
                }
                /* Respond Client */
                res.json({
                    result: books.slice(0, maximumRetrievedQueries),
                    msg: "Data Retrieved"
                });
            } else {
                res.json({
                    result: null,
                    msg: 'No Data Retrieved'
                });
            }
        })
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/editConfig/:userId', (req, res) => {
    const id = req.params.userId;
    const data = req.body;
    /* Write Data to Database */
    pg.updateRecord("users", id, Object.keys(data)[0], Object.values(data)[0]).then(() => {
        res.json({
            res: `Data Edited for userID ${id}`
        });
    }).catch(err => console.error('Update failed', err));
})
// Create HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});

process.on('SIGINT', async () => {
    console.log('Closing database pool...');
    await pool.end();
    process.exit(0);
});