const { app, BrowserWindow } = require('electron')

const electronReload = require('electron-reload');
electronReload("./classes/build");
electronReload("./public");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    
    win.loadFile('./public/index.html')
} 

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
      })
    
})