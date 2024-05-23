const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('IPC', {
  openMainWindow: (data) => ipcRenderer.send('open-main-window', data),
  opensignUpWindow: () => ipcRenderer.send('open-signUp-window'),
  openBookWindow: (bookId) => ipcRenderer.send('open-book-window', bookId),
  openSettingWindow: () => ipcRenderer.send('open-settings-window'),
  openNotesWindow: () => ipcRenderer.send('open-Notes-window'),
  openLibraryWindow: () => ipcRenderer.send('open-Library-window'),
  openRiwaqWindow: () => ipcRenderer.send('open-riwaq-window')
});