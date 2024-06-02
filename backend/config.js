const path = require('path')
const fs = require('fs')
const { copyFile } = require('./files')
const { checkOnline } = require('./misc')
/* Some Defualt Values */
const MAINPATH = path.join(__dirname + '/../');
const ASSETSPATH = path.join(MAINPATH, "static/assets");
const DATAPATH = path.join(MAINPATH, "/data");
const BOOKSPATH = path.join(DATAPATH, "/books");
const IQRAADB = path.join(MAINPATH, "/IQRAA.db");
const PORT = process.env.PORT || 1999;
// SOME SPEICAL DEFINE
const max = 1000000; // maximum ID of Books
const min = 1;// minimum ID of Books

/* Create Main Dirs */
function init() {
    fs.mkdir(`${DATAPATH}`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH} created successfully`);
    });
    /* Books Database */
    // Create a Books Table
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY UNIQUE,
        cover TEXT NOT NULL,
        title TEXT NOT NULL,
        pCount INTEGER NOT NULL,
        pDate DATE NOT NULL,
        rate INTEGER NOT NULL,
        author INTEGER NOT NULL,
        about TEXT NOT NULL,
         TEXT NOT NULL UNIQUE
        )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully.');
        }
    })
    /* Themes Directory */
    fs.mkdir(`${DATAPATH}/themes`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH}/themes created successfully`);
        copyFile(`${MAINPATH}static/style/darkTheme.css`, `${DATAPATH}/themes/darkTheme.css`);
        copyFile(`${MAINPATH}static/style/lightTheme.css`, `${DATAPATH}/themes/lightTheme.css`);
        copyFile(`${MAINPATH}static/style/arabic_text.ttf`, `${DATAPATH}/themes/arabic_text.ttf`);
        copyFile(`${MAINPATH}static/style/Old Antic Decorative.ttf`, `${DATAPATH}/themes/Old Antic Decorative.ttf`);
    });
    // Check Connection
    var isOnline = false;
    (async () => {
        const online = await checkOnline();
        if (online) {
            isOnline = true;
        } else {
            isOnline = false;
        }
    })();
    /* Create Config File */
    fs.writeFile(`${DATAPATH}/config.json`, `
        {
            "connection": "${isOnline}",
            "mode": "light",
            "dock": "show",
            "theme": [
                "bg-primary",
                "bg-success",
                "bg-danger",
                "bg-warning"
            ]
        }
        `, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log(`Successfully Config File Created`);
        }
    });
    /* Create Users File */
    fs.writeFile(`${DATAPATH}/users.json`, `[]`, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log(`Successfully Users File Created`);
        }
    });
}

module.exports = {
    init,
    MAINPATH,
    ASSETSPATH,
    DATAPATH,
    BOOKSPATH,
    PORT,
    max,
    min
}