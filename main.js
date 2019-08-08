const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const ipcM = electron.ipcMain

const os = require('os')
const url = require('url')
const path = require('path')
const log = require('electron-log')
const PDFWindow = require('electron-pdf-window')

const UserData = require('./userData.js')
const RiminderUrlUtils = require('./urlUtils.js')
const MenuUtils = require('./menuUtils.js')

const USR_DATA_FILEPATH = path.join(os.homedir(), '.riminder/gUserData.json').toString()

let mainWindow

let gUserData = UserData.loadFromfile(USR_DATA_FILEPATH)
if (gUserData === undefined) {
  log.info('startup', 'New empty user data created')
  gUserData = new UserData()
} else {
  log.info('startup', 'Previous user\'s datas available')
}

function updateUserTeam (webContents) {
  let currentUrl = url.parse(webContents.getURL())

  let isUpdated = gUserData.updateTeamFromUrl(currentUrl)
  if (isUpdated) {
    gUserData.saveToFile(USR_DATA_FILEPATH, (err) => {
      if (err) {
        log.error('UserData', err)
        return
      }
      log.info('runtime', 'Updated user\'s team')
    })
  }
}

function reopenWindow () {
  if (!mainWindow) {
    handleWindowReady()
  }
}
// handleWindowReady is called when the main window is ready to load a page
// it manage all app operations
function handleWindowReady () {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      webSecurity: false
    },
    icon: path.join(__dirname, 'build/linux/64x64.png')})

  MenuUtils.setWindowReOpener(reopenWindow)
  MenuUtils.applyDefaultMenu()
  // Usage of electron-pdf-window cause native pdf handling (plugin)
  // crash on riminder's dashboard
  PDFWindow.addSupport(mainWindow)

  mainWindow.loadURL(RiminderUrlUtils.selectSigninUrl(gUserData.team))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // The window will appear only when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // When a page is loaded try to update user's team from url
  mainWindow.webContents.on('did-finish-load', () => {
    updateUserTeam(mainWindow.webContents)
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (RiminderUrlUtils.isExternalUrl(url)) {
      shell.openExternal(url, true)
      event.preventDefault()
    }
  })

  // Event from render
  // prevent instant download of a profile attachement
  ipcM.on('dlDisabler', () => {
    mainWindow.webContents.session.once('will-download', (event, item, webContents) => {
      event.preventDefault()
    })
  })
}
app.on('ready', handleWindowReady)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    handleWindowReady()
  }
})
