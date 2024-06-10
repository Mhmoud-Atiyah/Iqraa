const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('IPC', {
  openMainWindow: (userId) => ipcRenderer.send('open-main-window', userId),
  opensignUpWindow: () => ipcRenderer.send('open-signUp-window'),
  openBookWindow: (bookId) => ipcRenderer.send('open-book-window', bookId),
  openAddBookWindow: () => ipcRenderer.send('open-Addbook-window'),
  openSettingWindow: () => ipcRenderer.send('open-settings-window'),
  openNotesWindow: () => ipcRenderer.send('open-Notes-window'),
  openLibraryWindow: () => ipcRenderer.send('open-Library-window'),
  openRiwaqWindow: (userId) => ipcRenderer.send('open-riwaq-window', userId)
});