//---------------------------------------------------------
// Windows Creating Routines
//---------------------------------------------------------
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { MAINPATH, ASSETSPATH } = require('./config')
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
/** Riwaq Window **/
function createRiwaqWindow() {
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
    win.loadFile(path.join(MAINPATH, 'static/riwaq.html'));
};
/** Notes Window **/
function createNotesWindow() {
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
};
/** Library Window **/
function createLibraryWindow() {
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
    win.loadFile(path.join(MAINPATH, 'static/library.html'));
};
/** Settings Window **/
function createSettingsWindow() {
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
};
/** Register New User **/
function createsignUpWindow() {
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
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    })
    win.loadFile(path.join(MAINPATH, 'static/signUp.html'));
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
    createsignUpWindow
}