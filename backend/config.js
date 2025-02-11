const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const {copyFile} = require('./files')
const {checkOnline, getIPAddress} = require('./connection')
/* Some Defualt Values */
const MAINPATH = path.join(__dirname + '/..');
const ASSETSPATH = path.join(MAINPATH, "/static/assets");
const DATAPATH = path.join(MAINPATH, "/data");
const USERSPATH = path.join(DATAPATH, "/users");
const CACHEPATH = path.join(DATAPATH, "/cache");
const DBPath = path.join(DATAPATH, "/iqraa.db");
const IQRAACPPPath = path.join(DATAPATH, "/iqraa");
//TODO: Set Ip of your Server
const DOMAIN = getIPAddress();
const PORT = process.env.PORT || 1999;
// SOME SPEICAL DEFINE
const max = 1000000; // maximum ID of Books
const min = 1;// minimum ID of Books

/* Create Main Dirs */
function init() {
    fs.mkdir(`${DATAPATH}`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH} created successfully`);
    })
    /* Themes Directory */
    fs.mkdir(`${DATAPATH}/themes`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH}/themes created successfully`);
        copyFile(`${MAINPATH}/static/style/darkTheme.css`, `${DATAPATH}/themes/darkTheme.css`);
        copyFile(`${MAINPATH}/static/style/lightTheme.css`, `${DATAPATH}/themes/lightTheme.css`);
        // copyFile(`${MAINPATH}/static/style/arabic_text.ttf`, `${DATAPATH}/themes/arabic_text.ttf`);
        // copyFile(`${MAINPATH}/static/style/Old Antic Decorative.ttf`, `${DATAPATH}/themes/Old Antic Decorative.ttf`);
    });
    /* Users Config Directory */
    fs.mkdir(`${DATAPATH}/users`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH}/configs created successfully`);
    });
    /* Generate IQraa Executable */
    copyFile(`${MAINPATH}/backend/Iqraa/build/iqraa`, `${IQRAACPPPath}`);
    /* Create Cache Dir */
    fs.mkdir(`${DATAPATH}/cache`, (err) => {
        if (err) throw err;
        console.log(`Directory: ${DATAPATH}/configs created successfully`);
    });
}

module.exports = {
    init,
    MAINPATH,
    IQRAACPPPath,
    ASSETSPATH,
    DATAPATH,
    USERSPATH,
    CACHEPATH,
    DBPath,
    DOMAIN,
    PORT,
    max,
    min
}