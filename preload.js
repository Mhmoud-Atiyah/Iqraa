const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('IPC', {
  openMainWindow: (userId) => ipcRenderer.send('open-main-window', userId),
  openBookWindow: (bookId) => ipcRenderer.send('open-book-window', bookId),
  openNotesWindow: () => ipcRenderer.send('open-Notes-window'),
  openLibraryWindow: (userId) => ipcRenderer.send('open-Library-window', userId),
  openRiwaqWindow: (userId) => ipcRenderer.send('open-riwaq-window', userId)
});