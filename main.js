const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const url = require('url')
const path = require('path')
const fs = require('fs')
const fx = require('mkdir-recursive')
const log = require('electron-log')
const os = require('os')

let mainWindow

class UserData {
  constructor () {
    this.team = undefined
  }
}

const linuxUserDataPath = path.join('/home', os.userInfo().username, '.riminder/userData.json').toString()

function getUserDataFromfile (filePath) {
  let userData = new UserData()

  try {
    let fileData = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'})
    log.info('ud', 'parse')
    let tmpuserData = JSON.parse(fileData.toString())
    Object.assign(userData, tmpuserData)
  } catch (e) {
    log.error('get ud', 'err: ' + e)
    return new UserData()
  }
  return userData
}

function saveUserDataToFile (ud, filePath) {
  let usString = JSON.stringify(ud)

  let fp = path.parse(filePath)
  log.info('save', 'fp.dir: ' + fp.dir)
  fx.mkdir(fp.dir, (err) => {
    if (err) {
      log.error('save', 'die mkdir: ' + err)
      return
    }

    fs.writeFile(filePath, usString, {
      mode: fs.constants.S_IRWXU | fs.constants.S_IRWXG
    }, (err) => {
      if (err) {
        log.error('userData', 'Cannot write ud: ' + err)
      }
    })
  })
}

console.log('hey')
let userData = getUserDataFromfile(linuxUserDataPath)

const signinUrl = url.format({
  protocol: 'https:',
  hostname: 'www.riminder.net',
  pathname: 'signin/team/'
})

function getDirectLoginUrl (team) {
  let _hostname = team + '.riminder.net'
  let res = url.format({
    protocol: 'https:',
    hostname: _hostname,
    pathname: 'dashboard'
  })
  return res
}

function createWindow () {
  mainWindow = new BrowserWindow({width: 1500,
    height: 1000,
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    titleBarStyle: 'hidden'})

  let signurl = signinUrl
  if (userData.team !== undefined) {
    signurl = getDirectLoginUrl(userData.team)
  }

  mainWindow.loadURL(signurl)

  mainWindow.on('closed', () => {
    console.log('pomme')
    mainWindow = null
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('url: ' + mainWindow.webContents.getURL())
    let currentUrl = url.parse(mainWindow.webContents.getURL())
    console.log('host: ' + currentUrl.hostname)
    let regex = new RegExp(/^(.+)\.riminder\.net$/)
    if (regex.test(currentUrl.hostname) && RegExp.$1 !== 'www') {
      userData.team = RegExp.$1
      log.info('url', 'heyy team is: ' + userData.team)
      saveUserDataToFile(userData, linuxUserDataPath)
    }
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
