const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')
// const log = require('electron-log')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 1500,
    height: 1000,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    titleBarStyle: 'hidden'})

  mainWindow.loadURL(url.format({
    protocol: 'https:',
    hostname: 'www.riminder.net',
    pathname: 'signin/team/'
  }))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
