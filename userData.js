const path = require('path')
const fs = require('fs')
const fx = require('mkdir-recursive')
const log = require('electron-log')

class UserData {
  constructor () {
    this.team = undefined
  }

  saveToFile (filePath) {
    let usString = JSON.stringify(this)

    let fp = path.parse(filePath)
    fx.mkdir(fp.dir, (err) => {
      if (err) {
        log.error('UserData', 'Cannot create user\'s data directory: ' + err)
        return
      }

      fs.writeFile(filePath, usString, {
        mode: fs.constants.S_IRWXU | fs.constants.S_IRWXG
      }, (err) => {
        if (err) {
          log.error('UserData', 'Cannot file user\'s data file: ' + err)
        }
      })
    })
  }

  static getUserDataFromfile (filePath) {
    let userData = new UserData()

    try {
      let fileData = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'})
      let tmpuserData = JSON.parse(fileData.toString())
      Object.assign(userData, tmpuserData)
    } catch (e) {
      log.error('UserData', 'Cannot load user\'s datas from file: ' + e)
      return new UserData()
    }
    return userData
  }
}

module.exports = UserData
