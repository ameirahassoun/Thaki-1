const { app, BrowserWindow } = require('electron')

require('electron-reload')(__dirname);

let user = require("os").userInfo().username;
let path = "/home/" + user + "/Downloads/";
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1200, height: 800})

  let mainSession = mainWindow.webContents.session;

  mainWindow.loadURL(`file://${__dirname}/main.html`);


  mainSession.on('will-download', (e, downloadItem, webContents) => {

    let size = downloadItem.getTotalBytes();
    let file = downloadItem.getFilename();
    
    downloadItem.setSavePath(path + file);
    
    downloadItem.on('updated', (e, state) => {
      let progress = Math.round((downloadItem.getReceivedBytes() / size) * 100)
      if (state === 'progressing') {
        mainWindow.webContents.send('dwn',  progress);
      }
    }) 
  mainWindow.on('closed', function () {
    mainWindow = null
  })
});
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  
  if (mainWindow === null) {
    createWindow()
  }
});