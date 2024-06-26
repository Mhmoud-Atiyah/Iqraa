//---------------------------------------------------------
// Windows Creating Routines
//---------------------------------------------------------

/* Main Libraries */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { MAINPATH, ASSETSPATH } = require('./config')

/* Global Variables Hold IF Windows Duplicated */
var notesWindow = false,
    libraryWindow = false,
    settingWindow = false,
    riwaqWindow = false;

//---------------------------------------------------------
// Windows
//---------------------------------------------------------

/** Login Modal **/
function createLoginWindow() {
    const win = new BrowserWindow({
        minHeight: 720,
        minWidth: 1280,
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(MAINPATH, 'preload.js'),
            nodeIntegration: true // Enable nodeIntegration
        }

    })
    win.loadFile(path.join(MAINPATH, "static/login.html"));
}

/** Main Window **/
function createMainWindow(id) {
    const win = new BrowserWindow({
        minHeight: 600,
        minWidth: 1280,
        width: 1280,
        height: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(MAINPATH, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadURL(`file://${path.join(MAINPATH, 'static/main.html')}?userId=${id}`);
};
/** Book View Window **/
function createBookWindow(bookId) {
    const win = new BrowserWindow({
        height: 690,
        width: 1024,
        // minHeight: 720,
        // minWidth: 720,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(MAINPATH, 'preload.js'),
            nodeIntegration: false
        }
    })
    win.loadURL(`file://${path.join(MAINPATH, 'static/bookView.html')}?bookId=${bookId}`);
}
/** Add Book View Window **/
function createAddbookWindow() {
    const win = new BrowserWindow({
        height: 720,
        width: 1024,
        minWidth: 1024,
        minHeight: 600,
        center: true,
        autoHideMenuBar: true,
        icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
        webPreferences: {
            preload: path.join(MAINPATH, 'preload.js'),
            nodeIntegration: false
        }
    })
    win.loadFile(path.join(MAINPATH, 'static/Addbook.html'));
}

//---------------------------------------------------------
// Dock Buttons
//---------------------------------------------------------

/** Notes Window **/
function createNotesWindow() {
    if (!notesWindow) {
        notesWindow = true;
        const win = new BrowserWindow({
            minHeight: 720,
            minWidth: 720,
            width: 720,
            height: 720,
            center: true,
            autoHideMenuBar: true,
            icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
            webPreferences: {
                preload: path.join(MAINPATH, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            }
        })
        win.loadFile(path.join(MAINPATH, 'static/notes.html'));
        win.on('closed', () => {
            notesWindow = false;
        });
    }
};
/** Library Window **/
function createLibraryWindow(id) {
    if (!libraryWindow) {
        libraryWindow = true;

        const win = new BrowserWindow({
            minHeight: 720,
            minWidth: 1024,
            width: 1280,
            height: 720,
            center: true,
            autoHideMenuBar: true,
            icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
            webPreferences: {
                preload: path.join(MAINPATH, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            }
        })
        win.loadURL(`file://${path.join(MAINPATH, 'static/library.html')}?userId=${id}`);

        win.on('close', () => {
            libraryWindow = false;
        })
    }
};
/** Riwaq Window **/
function createRiwaqWindow(id) {
    if (!riwaqWindow) {
        riwaqWindow = true;
        const win = new BrowserWindow({
            minHeight: 720,
            minWidth: 720,
            width: 1280,
            height: 720,
            center: true,
            autoHideMenuBar: true,
            icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
            webPreferences: {
                preload: path.join(MAINPATH, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            }
        })
        win.loadURL(`file://${path.join(MAINPATH, 'static/riwaq.html')}?userId=${id}`);

        win.on('close', () => {
            riwaqWindow = false;
        })
    }
};
/** Settings Window **/
function createSettingsWindow() {
    if (!settingWindow) {
        settingWindow = true;

        const win = new BrowserWindow({
            minHeight: 720,
            minWidth: 720,
            width: 720,
            height: 720,
            center: true,
            autoHideMenuBar: true,
            icon: path.join(ASSETSPATH, '/book-open-reader-solid.svg'),
            webPreferences: {
                preload: path.join(MAINPATH, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
                nodeIntegration: false
            }
        })
        win.loadFile(path.join(MAINPATH, 'static/settings.html'));

        win.on('closed', () => {
            settingWindow = false;
        });
    }
};

module.exports = {
    createLoginWindow,
    createMainWindow,
    createBookWindow,
    createAddbookWindow,
    createRiwaqWindow,
    createNotesWindow,
    createLibraryWindow,
    createSettingsWindow,
};