const path = require('path')
const fs = require('fs')
const fx = require('mkdir-recursive')
const log = require('electron-log')

// UserData is the representation of user's saved datas
class UserData {
  constructor () {
    this.team = undefined
  }

  // saveToFile saves this UserData instance to a file as a json
  // if the file already exist it will be truncated
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

  // loadFromfile loads an UserData structure from a json file
  static loadFromfile (filePath) {
    let userData = new UserData()

    try {
      let fileData = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'})
      let tmpuserData = JSON.parse(fileData.toString())
      Object.assign(userData, tmpuserData)
    } catch (e) {
      log.error('UserData', 'Cannot load user\'s datas from file: ' + e)
      return undefined
    }
    return userData
  }
}

module.exports = UserData
