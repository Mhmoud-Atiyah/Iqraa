const { app, ipcMain } = require('electron');
const server = require('./backend/server');
const sqlite = require('./backend/sqlite');
const { DBPath, init, DATAPATH, PORT } = require('./backend/config');
const { isItFirstTime } = require('./backend/misc');
const { portListening } = require('./backend/connection');
const {
    createLoginWindow,
    createMainWindow,
    createBookWindow,
    createRiwaqWindow,
    createNotesWindow,
    createLibraryWindow } = require('./backend/front');
//-------------------------//
//---- Pre-Start Check ----//
//-------------------------//
/** Check If it's First App Look ? */
if (isItFirstTime(DATAPATH)) {
    init();
}
//-----------------------//
//---- Start Backend ----//
//-----------------------//
/* 0. Start Iqraa Server */
portListening('localhost', PORT).then((isOpen) => {
    if (!isOpen) {  // First Client
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
});
/* 00. Start Database Server */
sqlite.checkDatabaseExists(DBPath).then((exists) => {
    if (exists) {
        console.log(`Database: [${DBPath}] exists and has tables.`);
    } else {
        console.log(`Database: [${DBPath}] does not exist or has no tables.`);
        // Create Database
        sqlite.createToDatabases(sqlite.db0Tables);
    }
}).catch((error) => {
    console.error(error);
})
//-------------------------//
//---- Start Front End ----//
//------------------------//
app.whenReady().then(() => {
    createLoginWindow();
    ipcMain.on('open-main-window', (event, data) => {
        createMainWindow(data);
    });
    ipcMain.on('open-book-window', (event, bookId, userId) => {
        createBookWindow(bookId, userId);
    });
    ipcMain.on('open-Notes-window', () => {
        createNotesWindow();
    });
    ipcMain.on('open-Library-window', (event, ID) => {
        createLibraryWindow(ID);
    });
    ipcMain.on('open-riwaq-window', (event, ID) => {
        createRiwaqWindow(ID);
    });
})
/*  On Close */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        //TODO: server.closeAllConnections(); ask if if all connections closed
        // Close the database connection
        sqlite.DB.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log(`Close the database:[${DBPath}] connection.`);
        });
    }
})