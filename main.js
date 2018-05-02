<<<<<<< HEAD
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const ipcM = electron.ipcMain
=======
// // Handle squirel events for windows
// const setupEvents = require('./installers/windows/setupEvents')
// if (setupEvents.handleSquirrelEvent()) {
//   return;
// }

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const contentTracing = electron.contentTracing
const shell = electron.shell
>>>>>>> 08bf68f61cacb857b8fbe2a544cd3ed36d4f141b

const os = require('os')
const url = require('url')
const path = require('path')
const log = require('electron-log')
const PDFWindow = require('electron-pdf-window')

const UserData = require('./userData.js')

const INTERNAL_LINK_REGEXP = new RegExp(url.format({protocol: 'https:', hostname: 'www.riminder.net'}))
// USER_DATA_PATH is the path to user's datas file
const USR_DATA_PATH = path.join(os.homedir(), '.riminder/gUserData.json').toString()

// URL_SIGNIN_PAGE is the url to riminder's sigin page (for now: www.riminder.net/signin/team)
const URL_SIGNIN_PAGE = url.format({protocol: 'https:', hostname: 'www.riminder.net', pathname: 'signin/team/'})

let mainWindow

function isExternalUrl (url) {
  return (!INTERNAL_LINK_REGEXP.test(url))
}

// Load user's datas from USR_DATA_PATH file, if the file is invalid use an
// empty UserData object
let gUserData = UserData.loadFromfile(USR_DATA_PATH)
if (gUserData === undefined) {
  gUserData = new UserData()
}

// getDirectLoginUrl create an url to user's dashboard for autologin
// it's need the user's team (the url is {user's team}.riminder.net/dashboard)
function getDirectLoginUrl (team) {
  let _hostname = team + '.riminder.net'
  let res = url.format({
    protocol: 'https:',
    hostname: _hostname,
    pathname: 'dashboard'
  })
  return res
}

// getTeamFromUrl extract the team from page url
// /!\ it can return "www" as a team especialy on sigin process
// but www is not a valid team
function getTeamFromUrl (url) {
  let regex = new RegExp(/^(.+)\.riminder\.net$/)

  if (!regex.test(url.hostname)) {
    return undefined
  }
  return RegExp.$1
}

// updateUserTeam change user's saved team name to newly extracted one
function updateUserTeam (webContents) {
  let currentUrl = url.parse(webContents.getURL())

  let team = getTeamFromUrl(currentUrl)
  if (team !== undefined && team !== 'www' && gUserData.team !== team) {
    gUserData.team = team
    gUserData.saveToFile(USR_DATA_PATH)
    log.info('runtime', 'Updated user\'s team')
  }
}

// handleWindowReady is called when the main window is ready to load a page
// it manage all app operations
function handleWindowReady () {
  // const options = {
  //   categoryFilter: '*',
  //   traceOptions: 'record-until-full,enable-sampling,trace-to-console'
  // }
  //
  // contentTracing.startRecording(options, () => {
  //   console.log('Tracing started')
  //
  //   setTimeout(() => {
  //     let tracePath = './tracelog'
  //     contentTracing.stopRecording(tracePath, (tracePath) => {
  //       console.log('Tracing data recorded to ' + path)
  //     })
  //   }, 5000)
  // })
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      webSecurity: false
    },
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    titleBarStyle: 'hidden'})

  PDFWindow.addSupport(mainWindow)

  // try to autologin if there is a team otherwise load signin url
  let signurl = URL_SIGNIN_PAGE
  if (gUserData.team !== undefined) {
    signurl = getDirectLoginUrl(gUserData.team)
    log.info('startup', 'Previous user\'s datas available')
  }
  // mainWindow.loadURL(url.format({protocol: 'https:', hostname: 'google.fr'}))
  mainWindow.loadURL(signurl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // When a page is loaded try to update user's team from url
  mainWindow.webContents.on('did-finish-load', () => {
    updateUserTeam(mainWindow.webContents)
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    log.info('wiill navigate ->', url)
    if (isExternalUrl(url)) {
      shell.openExternal(url, true)
      event.preventDefault()
    }
  })

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
