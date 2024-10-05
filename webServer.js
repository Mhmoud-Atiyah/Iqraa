const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const pool = require('./backend/pg');
const {generateHash} = require("./backend/encryption");
const pg = require('./backend/pg');
const {checkUserCredentials} = require("./backend/pg");
const {getCover, getAbout} = require("./backend/bookData");
const {ASSETSPATH, DOMAIN} = require('./backend/config');

const stylePath = path.join(__dirname, "static/style")
const USERSPATH = path.join(__dirname, "data/users");

const app = express();
const port = 443; // Default HTTPS port

const maximumRetrievedQueries = 4;
// Riwaq Clients
const riwaqConnectedClients = {};
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'data/cache/'); // Define the directory to save uploaded files
    }, filename: (req, file, cb) => {
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
/*******************************
 *   Main Page Requests
 ********************************/
app.get('/', (req, res) => {
    //TODO: on load https://iqraa.com redirect to page where to check user cred from localstorage
    res.sendFile(path.join(__dirname, "static", "main.html"));
});
app.get('/iqraa', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "main.html"));
})
app.get('/tag', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "main.html"));
})
/*******************************
 *   User Related Requests
 ********************************/
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "login.html"));
});
app.post('/login', (req, res) => {
    try {
        /****************
         * Get credentials
         * ***************/
        const {username, password} = req.body;
        /* If User Exist ? */
        (async () => {
            try {
                const exists = await pg.checkUserCredentials(username, password);
                if (exists != null) {
                    console.log(`User [userId: ${exists}] login with username [${username}]`);
                    /********************
                     * Get Data From Record
                     * *******************/
                    pg.getRecord("users", exists).then(data => {
                        res.json({
                            status: 0, // 0 => success | 1 => failure
                            userID: data.id,
                            profile: data.profile
                        })
                    });
                } else {
                    console.log('Invalid credentials');
                    res.json({
                        status: 1 // 0 => success | 1 => failure
                    })
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "signup.html"));
});
app.post('/signup', upload.single('file'), (req, res) => {
    try {
        /****************
         * Get Inputs
         * ***************/
        const {
            firstName,
            lastName,
            account,
            gender,
            dob,
            country,
            password
        } = req.body;
        const profilePic = req.file ? req.file.path : 'assets/profile.png';
        /******************
         * If User Exist ?
         * ****************/
        (async () => {
            try {
                const exists = await pg.checkUserCredentials(account, password);
                // User Exist
                if (exists != null) {
                    res.json({
                        status: 1,// 0 => success | 1 => failure
                        msg: `User [userId = ${exists.id}] Already has Account`
                    });
                }
                /****************
                 * Create New User
                 * ***************/
                else {
                    const userId = uuidv4();
                    pg.insertData('users', {
                        id: userId,
                        fname: firstName,
                        lname: lastName,
                        birth: dob,
                        country: country,
                        gender: gender,
                        account: account,
                        pass: password,
                        profile: req.file ? profilePic.split("-")[1] : 'assets/profile.png'
                    }).then(() => {
                        /*********************
                         * Create User's Tables
                         * *******************/
                        pg.createTable(`books_${userId}`,
                            "id integer references books(id) not null primary key," +
                            "dateread DATE DEFAULT CURRENT_DATE," +
                            "dateadd DATE DEFAULT CURRENT_DATE," +
                            "myrate double precision," +
                            "reviewid uuid not null," +
                            "bookshelf text," +
                            "bookshelves text[]," +
                            "hash text"
                        ).then(() => {
                            console.log(`User [userID: ${userId} ] Books Table Created Successfully`);
                            // Create Reviews Table
                            pg.createTable(`review_${userId}`,
                                `id integer references "books_${userId}"(id) not null primary key,` +
                                "review text," +
                                "threadid uuid[] not null," +
                                "hash text," +
                                "datereview timestamp," +
                                "likescount integer," +
                                "commentscount integer"
                            ).then(() => {
                                console.log(`User [userID: ${userId} ] Reviews Table Created Successfully`)
                            });
                        });
                        /*******************
                         * Create User's Dir
                         * *****************/
                        fs.mkdir(path.join(USERSPATH, `${userId}`), (err) => {
                            if (err) {
                                console.error('Error creating directory:', err);
                            } else {
                                // Move Profile Pic to User Dir
                                (async () => {
                                    try {
                                        await fs.rename(path.join(__dirname, profilePic), path.join(USERSPATH, `${userId}`, profilePic.split("-")[1]), (err) => {
                                            if (err) throw err;
                                            console.log(`User [userID: ${userId} ] Directory Created Successfully`);
                                        });
                                    } catch (error) {
                                        console.error(`Error moving file: ${error.message}`);
                                    }
                                })();
                            }
                        });
                        // respond Client
                        res.json({
                            status: 0,
                            msg: `User [userID: ${userId} ] Created Successfully`
                        })
                    })
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.get('/loadConfig/:userId', (req, res) => {
    const id = req.params.userId;
    /**************
     * User OR Internet
     * *************/
    if (id !== '' || id !== undefined) {
        /****
         * Get Needed Data From Record
         * ***/
        pg.getRecord("users", id).then(data => {
            delete data.pass;
            res.send(data);
        });
    }
    /*************
     * Internet User
     * ************/
    else {
        res.json({
            msg: "Internet User View"
        });
    }
});
// TODO: Convert this method to include hash in req.body
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
app.post('/loadUserSection', (req, res) => {
    try {
        /***
         * Get credentials
         * */
        const {userId, hashedPass, section} = req.body;
        /********************
         * User Authorized
         * ******************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                    try {
                        /***************************
                         * Get Data From User Database
                         * **************************/
                        pg.loadMainView(userId, section).then(books => {
                            res.json(books);
                        });
                    } catch (error) {
                        res.status(500).send('Internal Server Error');
                    }
                }
            )();
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
app.post('/addToMyBooks', (req, res) => {
    try {
        /***
         * Add With Read Tag
         * */
        if (req.body.data !== undefined) {
            /***
             * Get credentials
             * */
            const {bookId, userId, hashedPass, data} = req.body;
            /********************
             * User Authorized
             * ******************/
            if (pg.authenticateUser(userId, hashedPass)) {
                (async () => {
                        try {
                            /*******************
                             * Check book Existence
                             * ******************/
                            const exists = await pg.checkIfIdExists(`books_${userId}`, bookId);
                            /***
                             * First Time
                             * */
                            if (!exists) {
                                /************
                                 * Add new Book
                                 * **********/
                                pg.insertData(`books_${userId}`, {
                                    id: bookId,
                                    dateRead: data[0] || new Date(),
                                    dateadd: data[1] || new Date(),
                                    bookshelf: data[2],
                                    reviewId: userId,//TODO: create database relation for this
                                    bookShelves: data[4],
                                    myRate: data[5]
                                }).then(() => {
                                    console.log(`Book of id [${bookId}] added to user [${userId}] table`);
                                    res.json({
                                        status: 0,
                                        msg: `Book of id [${bookId}] added to user [${userId}] table`
                                    })
                                });
                            }
                            /***
                             * read or to-read
                             * */
                            else {
                                pg.updateRecords(`books_${userId}`, bookId, {
                                    dateRead: data[0] || new Date(),
                                    dateadd: data[1] || new Date(),
                                    bookshelf: data[2],
                                    reviewId: userId,//TODO: create database relation for this
                                    bookShelves: data[4],
                                    myRate: data[5],
                                }).then(() => {
                                    console.log(`Book of id [${bookId}] already exist in user [${userId}] table`);
                                    res.json({
                                        status: 0,
                                        msg: `Book of id [${bookId}] already exist in user [${userId}] table so bookshelf updated only!`
                                    });
                                });
                            }
                        } catch (error) {
                            res.status(500).send('Internal Server Error');
                        }
                    }
                )();
            }
        }
        /***
         * Add With Want Tag
         * */
        else {
            /***
             * Get credentials
             * */
            const {bookId, userId, hashedPass} = req.body;
            /********************
             * User Authorized
             * ******************/
            if (pg.authenticateUser(userId, hashedPass)) {
                (async () => {
                        try {
                            /*******************
                             * Check book Existence
                             * ******************/
                            const exists = await pg.checkIfIdExists(`books_${userId}`, bookId);
                            /***
                             * First Time
                             * */
                            if (!exists) {
                                /************
                                 * Add new Book
                                 * **********/
                                pg.insertData(`books_${userId}`, {
                                    id: bookId,
                                    dateadd: new Date(),
                                    dateread: null,
                                    bookshelf: 'to-read',
                                    //TODO: create database relation for this
                                    reviewId: userId
                                }).then(() => {
                                    console.log(`Book of id [${bookId}] added to user [${userId}] table`);
                                    res.json({
                                        status: 0,
                                        msg: `Book of id [${bookId}] added to user [${userId}] table`
                                    })
                                });
                            }
                            /***
                             *  Read Already Not Want
                             * */
                            else {
                                pg.updateRecords(`books_${userId}`, bookId, {
                                    dateread: null,
                                    bookshelf: 'to-read'
                                }).then(() => {
                                    console.log(`Book of id [${bookId}] already exist in user [${userId}] table`);
                                    res.json({
                                        status: 0,
                                        msg: `Book of id [${bookId}] already exist in user [${userId}] table so bookshelf updated only!`
                                    });
                                });
                            }
                        } catch (error) {
                            res.status(500).send('Internal Server Error');
                        }
                    }
                )();
            }
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
app.post('/deleteFromMyBooks', (req, res) => {
    try {
        /***
         * Get credentials
         * */
        const {bookId, userId, hashedPass} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /*******************
                     * Check book Existence
                     * ******************/
                    const exists = await pg.checkIfIdExists(`books_${userId}`, bookId);
                    if (exists) {
                        pg.deleteRecord(`books_${userId}`, bookId).then(() => {
                            res.json({
                                status: 0,
                                msg: `user [userId: ${userId}] remove book [bookId: ${bookId}] form his Data`
                            })
                            console.log(`user [userId: ${userId}] remove book [bookId: ${bookId}] form his Data`);
                        });
                    }
                    // User not own this book
                    else {
                        res.json({
                            status: 1,
                            msg: `user [userId: ${userId}] have no book [bookId: ${bookId}] on his Data`
                        })
                    }
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.post('/loadUserReview', (req, res) => {
    try {
        /***
         * Get credentials
         * */
        const {userId, hashedPass, table, book} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /*******************
                     * Check Book(user review) Existence
                     * ******************/
                    const exists = await pg.checkIfIdExists(`review_${table}`, book);
                    if (exists) {
                        pg.getRecord(`review_${table}`, Number(book)).then(reviewData => {
                            pg.getUsersRecords([table]).then(userData => {
                                delete userData[0].account;
                                delete userData[0].socket;
                                // TODO: Future If delete userId from response
                                res.json({
                                    status: 0,
                                    msg: {
                                        review: reviewData,
                                        user: userData[0]
                                    }
                                })
                            });
                        }).then(() => {
                            console.log(`User [userId: ${userId}] try to retrieve Review of book [bookId: ${book}] from user [userId: ${table}] review table.`);
                        })
                    }
                    // User has no review on this book
                    else {
                        res.json({
                            status: 1,
                            msg: `user [userId: ${userId}] have no book [bookId: ${book}] on his Data`
                        })
                    }
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
/*******************************
 *   Books Related Requests
 ********************************/
app.get('/loadBookData/:userId/:bookId', (req, res) => {
    const userID = req.params.userId; // UUID
    const bookID = req.params.bookId || 1; // Number
    /*****************
     * User OR Internet
     * ****************/
    if (userID !== '' || userID !== undefined) {
        /****************************
         * Get Needed Data From Record
         * ***************************/
        pg.getRecord(`books_${userID}`, Number(bookID)).then(data1 => {
            pg.getRecord(`books`, Number(bookID)).then(data2 => {
                const authorID = data2.authorid;
                pg.getRecord(`authors`, Number(authorID)).then(data3 => {
                    res.json({...data1, ...data2, author: data3})
                })
            });
        });
    }
    /*************
     * Internet User
     * ************/
    else {
        pg.getRecord(`books`, Number(bookID)).then(data1 => {
            const authorID = data1.authorid;
            pg.getRecord(`authors`, Number(authorID)).then(data2 => {
                res.json({...data1, author: data2})
            })
        });
    }
});
app.get('/loadBooksDataMain/:booksIds', (req, res) => {
    const booksIDs = req.params.booksIds.split(',') || 1; // Numbers
    /*************
     * Load Data
     * ************/
    pg.getRecordBooks('books', booksIDs).then(data => {
        res.json({
            status: 0,
            msg: data
        })
    });
});
app.get('/loadAuthorData/:authorId', (req, res) => {
    const authorId = req.params.authorId;
    pg.getRecord(`authors`, Number(authorId)).then(authorData => {
        res.json({
            status: 0,
            author: authorData
        })
    }).catch(err => {
        res.json({
            status: 500,
            author: `Error On Retrieve Author [authorId: ${authorId}] Data`
        })
    })
});
app.post('/goodreads', upload.single('file'), (req, res) => {
    const {userId, hashedPass} = req.body;
    const dataFile = req.file ? req.file.path : null;
    /****************
     * If User Exist ?
     * **************/
    (async () => {
        try {
            const exists = await pg.getRecord("users", userId);
            if (exists != null) {
                if (hashedPass != null && hashedPass === exists.pass) {
                    /****************
                     * Assign User Data
                     * **************/
                    if (dataFile != null) {
                        try {
                            fs.readFile(dataFile, 'utf8', (err, data) => {
                                if (err) console.error(err);
                                const Books = JSON.parse(data);
                                /************
                                 * Write Data
                                 * **********/
                                // TODO: Wait Until Build Iqraa Database
                                // Respond to Client
                                res.json({
                                    status: 0,
                                    msg: "Goodreads Data Assigned Successfully"
                                });
                            });
                        } catch (error) {
                            console.error(`Error reading or parsing file: ${error.message}`);
                            // Respond with an error status
                            res.status(500).json({
                                status: 1,
                                msg: "Error reading or parsing file",
                                error: error.message
                            });
                        }
                    } else {
                        return res.status(400).send('No file uploaded.');
                    }
                    /*******************
                     * Update User Entry
                     * *****************/
                    pg.updateRecord("users", userId, "newuser", false).then(() => {
                        console.log(`Data Edited for userID ${userId}`);
                    }).catch(err => console.error('Update failed', err));
                    /****************
                     * Go back to Main
                     * **************/
                    // res.redirect(`/iqraa?userId=${id}`);
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
});
//TODO: There is book view default and one for library
app.get('/bookview', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "bookView.html"));
})
/*******************************
 *   Library's Requests
 ********************************/
app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "library.html"));
})
app.post('/loadLibrary', (req, res) => {
    const {userId, libraryId, hashedPass} = req.body;
    /* Get Data From User Database */
    (async () => {
        try {
            const exists = await pg.getRecord("users", userId);
            if (exists != null) { // Exist as User Not Library User !
                /* Check Password */
                if (hashedPass != null && hashedPass === exists.pass) {
                    if (libraryId != null) {
                        pg.getRecord("library", libraryId).then(libraryData => {
                            // check if UserId is Library Admin
                            if (libraryData != null) {
                                if (libraryData.adminid === Number(userId)) {
                                    res.send(libraryData);
                                    console.log(`${libraryData.title} Library Retrieved Successfully by Admin [userId: ${userId}]`);
                                } else { // check if UserId in Library Parties or Library is Public
                                    if (libraryData.parties.includes(Number(userId)) || libraryData.access === "public") {
                                        // Drop Sensitive Data
                                        delete libraryData.adminid;
                                        delete libraryData.hash;
                                        delete libraryData.access;
                                        delete libraryData.requests;
                                        // if Library Viewed Public
                                        if (libraryData.access === "public") delete libraryData.parties;
                                        res.send(libraryData);
                                        console.log(`${libraryData.title} Library Retrieved Successfully by Party [userId: ${userId}]`);
                                    } else {// Not Admin nor Parties
                                        res.send(`[userId: ${userId}] Not Belong To Library [${libraryId}]`);
                                    }
                                }
                            }
                        });
                    }
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
})
app.post('/loadLibraries', (req, res) => {
    const {userId, libraryId, hashedPass} = req.body;
    /* Get Data From User Database */
    (async () => {
        try {
            const exists = await pg.getRecord("users", userId);
            if (exists != null) { // Exist as User Not Library User !
                /* Check Password */
                if (hashedPass != null && hashedPass === exists.pass) {
                    pg.getRecord("library", libraryId).then(libraryData => {
                        if (libraryData != null) {
                            res.json({
                                id: libraryData.id, title: `${libraryData.title}`
                            });
                        }
                    });
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
})
app.get('/loadLibrarySection/:section', (req, res) => {
    const sectionId = req.params.section || null;
    if (sectionId != null) {
        pg.getLibrarySectionBooks(String(sectionId)).then(data => {
            // Drop Sensitive Data

            res.send(data);
        })
    }
})
app.post('/createLibrary/:userId', upload.single('CL_Cover'), (req, res) => {
    const id = req.params.userId;
    const {
        CL_Name,
        CL_Location,
        CL_Type,
        CL_Currency,
        CL_About,
        CL_SM_website,
        CL_SM_twitter,
        CL_SM_facebook,
        CL_SM_instagram
    } = req.body;
    const libraryCover = req.file ? req.file.path : 'No file uploaded';
    const GIS = req.body.CL_GIS.split(",") || null;
    const libraryId = uuidv4();
    const libraryMain = uuidv4();
    console.log("line 1")
    /* Write Data To Database */
    pg.insertData('library', {
        id: libraryId,
        adminid: id,
        title: CL_Name,
        type: CL_Type,
        cover: libraryCover,
        hash: generateHash(libraryId),/*TODO: make more robust one */
        parties: [id],
        main: libraryMain,
        currency: CL_Currency,
        about: CL_About,
        location: CL_Location,
        latitude: GIS !== null ? GIS[0] : 0.0,
        longitude: GIS !== null ? GIS[1] : 0.0,
        socialmedia: [CL_SM_website, CL_SM_twitter, CL_SM_facebook, CL_SM_instagram],
        access: "private" //TODO: get it from form
    }).then(() => {

        console.log("line 2")
        /* Create main Library table */
        pg.createTable(`"${libraryMain}"`, `
        bookid    int NOT NULL REFERENCES books (id) ON DELETE SET NULL,
        hash      text,
        price     int,
        state     text,
        section     text,
        available text`).then(() => {

            console.log("line 3")
            pg.updateRecord("users", id, "mylibrary", libraryId).then(() => {

                console.log("line 4")
                console.log(`library [${libraryId}] created successfully`);
            }).catch(err => console.error('Update failed', err));
        });
    });
    /* Go back to Main Again */
    res.redirect(`/library?libraryId=${libraryId}&userId=${id}`);
});
app.post('/joinLibrary', (req, res) => {
    const {userId, libraryId, hashedPass} = req.body;
    /* Get Data From User Database */
    (async () => {
        try {
            const exists = await pg.getRecord("users", userId);
            if (exists != null) { // Exist as User Not Library User !
                /* Check Password */
                if (hashedPass != null && hashedPass === exists.pass) {
                    if (libraryId != null) {
                        pg.getRecord("library", libraryId).then(libraryData => {
                            if (libraryData != null) {
                                /* check library access mode */
                                if (libraryData.access === "public") { // Anyone can join
                                    /* Write Data to Library Table */
                                    pg.updateRecord_Push("library", libraryData.id, "parties", userId).then(() => {
                                        console.log(`User [ID: ${userId}] added to Library [ID: ${libraryId}] successfully`);
                                        /* Add Library to User Entry */
                                        pg.updateRecord_Push("users", userId, "libraries", libraryData.id).then(() => {
                                            console.log(`User [ID: ${userId}] Accessed Library [ID: ${libraryId}] successfully`);
                                        });
                                        /* Respond To Client */
                                        res.json({
                                            status: 0, // status => 0: success
                                            msg: `User [ID: ${userId}] added to Library [ID: ${libraryId}] successfully`
                                        });
                                    })
                                } else {
                                    /* Send To Library Admin */
                                    console.log(`User [ID: ${userId}] Try to Join to Private Library [ID: ${libraryId}]`);
                                    pg.updateRecord_Push('library', libraryData.id, "requests", userId).then(() => {
                                        console.log(`User [ID: ${userId}] Added to Library [ID: ${libraryId}] Requests List`);
                                        /* Respond To Client */
                                        res.json({
                                            status: 1, // status => 1: waitList
                                            msg: `User [ID: ${userId}] Wait For Library [ID: ${libraryId}] Admin To Approve`
                                        });
                                    });
                                }
                            }
                        });
                    }
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
})
app.post('/libraryExcel/:userId', upload.single('file'), (req, res) => {
    const id = req.params.userId;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const dataPath = req.file.path;
    /* Write Data To Database */

    /* Go back to Main Again */
    res.redirect(`/library?userId=${id}`);
});
/*******************************
 *   Riwaq's Requests
 ********************************/
app.get('/riwaq', (req, res) => {
    res.sendFile(path.join(__dirname, "static", "riwaq.html"));
})
app.post('/sessionData', (req, res) => {
    try {
        /***
         * Get credentials
         *  */
        const {userId, hashedPass, sessionID} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /***
                     * Get Session Data
                     * */
                    pg.getRecord('riwaq', sessionID).then((sessionData) => {
                        console.log(`userId [userId: ${userId}] Retrieve session [title: ${sessionData.title}] Data`);
                        /***
                         * respond to client
                         * */
                        res.json({
                            status: 0,
                            msg: `userId [userId: ${userId}] Retrieve session [title: ${sessionData.title}] Data`,
                            data: sessionData
                        });
                    });
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        } else {
            console.error(`user [userId: ${userId}] Not Authorized to retrieve Session Data`);
            res.json({
                status: 1,
                msg: `user [userId: ${userId}] Not Authorized to retrieve Session`
            })
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
app.post('/sessionUsers', (req, res) => {
    try {
        /***
         * Get credentials
         *  */
        const {userId, hashedPass, userIDs} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /***
                     * Get Session Users Data
                     * */
                    pg.getUsersRecords(userIDs).then((sessionUsers) => {
                        console.log(`userId [userId: ${userId}] Retrieve session Users Data`);
                        /***
                         * respond to client
                         * */
                        res.json({
                            status: 0,
                            msg: `userId [userId: ${userId}] Retrieve session Users Data`,
                            data: sessionUsers
                        });
                    });
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        } else {
            console.error(`user [userId: ${userId}] Not Authorized to retrieve Session Users Data`);
            res.json({
                status: 1,
                msg: `user [userId: ${userId}] Not Authorized to retrieve Session Users Data`
            })
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})
app.post('/initSession', (req, res) => {
    try {
        /***
         * Get credentials
         *  */
        const {userId, hashedPass, sessionTitle} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /***
                     * Create Session
                     * */
                    const sessionId = uuidv4();
                    pg.insertData('riwaq', {
                        adminid: userId,
                        id: sessionId,
                        title: sessionTitle,
                        live: true
                    }).then(() => {
                        console.log(`userId [userId: ${userId}] create session [title: ${sessionTitle}]`);
                        /***
                         * respond to client
                         * */
                        res.json({
                            status: 0,
                            msg: `userId [userId: ${userId}] create session [title: ${sessionTitle}]`,
                            Id: sessionId
                        });
                    });
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        } else {
            console.error(`user [userId: ${userId}] Not Authorized to init Session`);
            res.json({
                status: 1,
                msg: `user [userId: ${userId}] Not Authorized to init Session`
            })
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.post('/joinSession', (req, res) => {
    try {
        /***
         * Get credentials
         *  */
        const {userId, hashedPass, sessionId, socketId} = req.body;
        /***************
         * User Authorized
         * **************/
        if (pg.authenticateUser(userId, hashedPass)) {
            (async () => {
                try {
                    /***
                     * Join Session
                     * */
                    pg.getRecord('riwaq', sessionId).then(session => {
                        if (session.live) {
                            /***
                             * Ask Admin For Join
                             * */
                            pg.getRecord('users', session.adminid).then(adminData => {
                                const adminSocketID = adminData.socket;
                                const socket = riwaqConnectedClients[adminSocketID];
                                if (socket) {
                                    /****
                                     * get client data
                                     * */
                                    pg.getRecord('users', userId).then(clientData => {//TODO: try to optimize this (get column not all record)
                                        socket.emit('data', {
                                            type: 'ask',
                                            id: userId,
                                            socket: socketId,
                                            account: clientData.account,
                                            name: clientData.fname + " " + clientData.lname,
                                            profile: clientData.profile
                                        });
                                        /****
                                         * Respond Client
                                         * */
                                        res.json({
                                            status: 0,
                                            msg: `Ask for join sent to admin`
                                        })
                                    });
                                } else {
                                    console.log(`user [userId: ${userId}] try to join session [id: ${sessionId}] but Admin [userId: ${adminData.id}] has no session!`);
                                }
                            });
                        }
                        /***
                         * Recorded Session
                         * */
                        else {
                            //     TODO: Future !
                        }
                    });
                } catch (error) {
                    res.status(500).send('Internal Server Error');
                }
            })();
        } else {
            console.error(`user [userId: ${userId}] Not Authorized to Join to Session [${sessionId}]`);
            res.json({
                status: 1,
                msg: `user [userId: ${userId}] Not Authorized to Join Session [${sessionId}]`
            })
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
/*******************************
 *   miscellaneous Requests
 ********************************/
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
/*******************************
 *   Searching Requests
 ********************************/
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
                    result: books.slice(0, maximumRetrievedQueries), msg: "Data Retrieved"
                });
            } else {
                res.json({
                    result: null, msg: 'No Data Retrieved'
                });
            }
        })
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
/*******************************
 *   Main Routine
 ********************************/
const server = https.createServer(options, app);
// Create a Socket.IO server using the HTTP server
const sockets = socketIo(server);
// Handle Socket.IO connections
sockets.on('connection', (socket) => {
    console.log(`New Riwaq client connected with ID: ${socket.id}`);
    riwaqConnectedClients[socket.id] = socket;

    // Send a welcome message to the newly connected client
    socket.emit('data', {type: 'init', id: socket.id, message: 'Welcome to the Riwaq server!'});
    // Handle messages from clients
    socket.on('message', (message) => {
        console.log('Received:', message);

        // Broadcast the message to all connected clients
        sockets.emit('message', message);
    });
    // Handle Ask Permission Requests
    socket.on('askPermission', (req) => {
        const {permit, socket} = req;
        const clientSocket = riwaqConnectedClients[socket];
        /***
         * Permit Client
         * */
        if (permit) {
            const {sessionId, client} = req;
            // Respond Client
            if (clientSocket) {
                clientSocket.emit('resPermission', {
                    permit: true
                });
            }
            // Write Data
            pg.updateRecord_Push('riwaq', sessionId, 'partiesids', client);
        }
        /***
         * Decline Client
         * */
        else {
            if (clientSocket) {
                clientSocket.emit('resPermission', {
                    permit: false
                });
            }
        }
    })
    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Riwaq Client disconnected with ID: ${socket.id}`);
        delete riwaqConnectedClients[socket.id];
    });
});
// init Server
server.listen(port, () => {
    console.log(`Server running at https://${DOMAIN}:${port}`);
})
process.on('SIGINT', async () => {
    console.log('Closing database pool...');
    await pool.end();
    process.exit(0);
});