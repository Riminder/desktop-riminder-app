const assert = require('better-assert')

const fs = require('fs')
const url = require('url')
const UserData = require('../userData')

describe('userData', function () {
  describe('saveToFile', function () {
    it('should create a file with instance\'s datas with no error', function (done) {
      let ud = new UserData()
      let filePath = './zap.json'
      ud.team = 'zap'
      ud.saveToFile(filePath, (err) => {
        assert(!err)
        let res = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'})
        let resp = JSON.stringify(ud)
        assert(res === resp)
        done()
      })
    })
  })
  describe('updateTeamFromUrl', function () {
    it('should extract team from url(type: string) update instance and return it', function () {
      let testUrl = url.format({protocol: 'https:', hostname: 'zap.riminder.net'})
      let ud = new UserData()
      let refTeam = 'zap'
      let resTeam = ud.updateTeamFromUrl(testUrl.toString())
      assert(refTeam === resTeam)
    })
    it('should extract team from url(type: url) update instance and return it', function () {
      let testUrl = new url.Url()
      testUrl.protocol = 'https:'
      testUrl.hostname = 'zap.riminder.net'
      let ud = new UserData()
      let refTeam = 'zap'
      let resTeam = ud.updateTeamFromUrl(testUrl)
      assert(refTeam === resTeam)
    })
    it('should return undefined, not a riminder url', function () {
      let testUrl = new url.Url()
      testUrl.protocol = 'https:'
      testUrl.hostname = 'zap.hey.net'
      let ud = new UserData()
      let refTeam
      let resTeam = ud.updateTeamFromUrl(testUrl)
      assert(refTeam === resTeam)
      testUrl.hostname = 'zap.riminder.com'
      ud.team = 'pomm'
      resTeam = ud.updateTeamFromUrl(testUrl)
      assert(refTeam === resTeam)
    })
    it('should return undefined, not a valid team', function () {
      let testUrl = new url.Url()
      testUrl.protocol = 'https:'
      testUrl.hostname = 'www.riminder.net'
      let ud = new UserData()
      let refTeam
      let resTeam = ud.updateTeamFromUrl(testUrl)
      assert(refTeam === resTeam)
      testUrl.hostname = 'pomm.riminder.com'
      ud.team = 'pomm'
      resTeam = ud.updateTeamFromUrl(testUrl)
      assert(refTeam === resTeam)
    })
  })
})
