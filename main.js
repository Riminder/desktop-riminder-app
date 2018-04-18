const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')
const log = require('electron-log')
const os = require('os')

const UserData = require('./userData.js')

const LINUX_USR_DATA_PATH = path.join(os.homedir(), '.riminder/gUserData.json').toString()
const MACOS_USR_DATA_PATH = path.join(os.homedir(), '.riminder/gUserData.json').toString()
const WINDOWS_USR_DATA_PATH = path.join(os.homedir(), '.riminder/gUserData.json').toString()

function selectUserDataPath () {
  switch (process.platform) {
    case 'linux':
      return LINUX_USR_DATA_PATH
    case 'darwin':
      return MACOS_USR_DATA_PATH
    case 'win32':
      return WINDOWS_USR_DATA_PATH
    default:
      log.error('startup', 'OS not suported')
      app.quit()
  }
}

const USR_DATA_PATH = selectUserDataPath()

const URL_SIGNIN_PAGE = url.format({protocol: 'https:', hostname: 'www.riminder.net', pathname: 'signin/team/'})

let mainWindow

let gUserData = UserData.loadFromfile(USR_DATA_PATH)
if (gUserData === undefined) {
  gUserData = new UserData()
}

function getDirectLoginUrl (team) {
  let _hostname = team + '.riminder.net'
  let res = url.format({
    protocol: 'https:',
    hostname: _hostname,
    pathname: 'dashboard'
  })
  return res
}

function getTeamFromUrl (url) {
  let regex = new RegExp(/^(.+)\.riminder\.net$/)

  if (!regex.test(url.hostname)) {
    return undefined
  }
  return RegExp.$1
}

function updateUserTeam (webContents) {
  let currentUrl = url.parse(webContents.getURL())

  let team = getTeamFromUrl(currentUrl)
  if (team !== undefined && team !== 'www' && gUserData.team !== team) {
    gUserData.team = team
    gUserData.saveToFile(USR_DATA_PATH)
    log.info('runtime', 'Updated user\'s team')
  }
}

function handleWindowReady () {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    titleBarStyle: 'hidden'})

  let signurl = URL_SIGNIN_PAGE
  if (gUserData.team !== undefined) {
    signurl = getDirectLoginUrl(gUserData.team)
    log.info('startup', 'Previous user\'s available')
  }

  mainWindow.loadURL(signurl)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    updateUserTeam(mainWindow.webContents)
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
