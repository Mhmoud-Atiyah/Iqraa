const fs = require('fs');
const { app, ipcMain } = require('electron');
const server = require('./backend/server');
const { MAINPATH, init, DATAPATH, PORT } = require('./backend/config');
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
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
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
    ipcMain.on('open-riwaq-window', () => {
        createRiwaqWindow();
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