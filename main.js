const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')
const log = require('electron-log')
const os = require('os')

const UserData = require('./userData.js')

const LINUX_USR_DATA_PATH = path.join('/home', os.userInfo().username, '.riminder/gUserData.json').toString()
const URL_SIGNIN_PAGE = url.format({protocol: 'https:', hostname: 'www.riminder.net', pathname: 'signin/team/'})

let mainWindow
let gUserData = UserData.getUserDataFromfile(LINUX_USR_DATA_PATH)

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
    let currentUrl = url.parse(mainWindow.webContents.getURL())

    let team = getTeamFromUrl(currentUrl)
    if (team !== undefined && team !== 'www' && gUserData.team !== team) {
      gUserData.team = team
      gUserData.saveToFile(LINUX_USR_DATA_PATH)
      log.info('runtime', 'Updated user data')
    }
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
