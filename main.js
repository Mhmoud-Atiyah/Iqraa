const fs = require('fs');
const { app, ipcMain } = require('electron');
const server = require('./backend/server');
const sqlite = require('./backend/sqlite');
const { MAINPATH, USERDB, init, DATAPATH, PORT } = require('./backend/config');
const { copyFile } = require('./backend/files');
const { isItfirstTime, checkOnline } = require('./backend/misc');
const {
    createLoginWindow,
    createMainWindow,
    createBookWindow,
    createAddbookWindow,
    createRiwaqWindow,
    createNotesWindow,
    createLibraryWindow,
    createSettingsWindow,
    createsignUpWindow
} = require('./backend/front');

/**
 * Start Backend
*/
// 0. Start Data Server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// 1. Start Database Server
sqlite.checkDatabaseExists(USERDB).then((exists) => {
    if (exists) {
        console.log(`Database: [${USERDB}] exists and has tables.`);
    } else {
        console.log(`Database: [${USERDB}] does not exist or has no tables.`);
        // Create Database
        sqlite.createAllDatabases();
    }
}).catch((error) => {
    console.error(error);
});

/* 
    Start Front End
*/
app.whenReady().then(() => {
    /** Check If it's First App Look ? */
    if (isItfirstTime(DATAPATH)) {
        init();
    };
    createLoginWindow();
    ipcMain.on('open-main-window', (event, data) => {
        createMainWindow(data);
    });
    ipcMain.on('open-signUp-window', () => {
        createsignUpWindow();
    });
    ipcMain.on('open-book-window', (event, data) => {
        createBookWindow(data);
    });
    ipcMain.on('open-settings-window', () => {
        createSettingsWindow();
    });
    ipcMain.on('open-Addbook-window', () => {
        createAddbookWindow();
    });
    ipcMain.on('open-Notes-window', () => {
        createNotesWindow();
    });
    ipcMain.on('open-Library-window', () => {
        createLibraryWindow();
    });
    ipcMain.on('open-riwaq-window', (event, data) => {
        createRiwaqWindow(data);
    });
})
/* 
    On Close
*/
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})