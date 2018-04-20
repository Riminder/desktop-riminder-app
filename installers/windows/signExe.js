// script that sign the package

const path = require('path')
const commandLineArgs = require('command-line-args')
const log = require('electron-log')
const signtool = require('signtool')

let args = commandLineArgs([
  {name: 'cert-path', type: String, defaultOption: true},
  {name: 'cert-passw', type: String, defaultValue: ''}], { camelCase: true })

let signCertPath
let signCertPassword

signCertPath = args.certPath
signCertPassword = args.certPassw

log.info('Sign package - ', 'Starting package signature...')
signtool.sign('release-builds/riminder-win32-ia32/riminder.exe', {
  certificate: `${path.resolve(signCertPath)}`,
  password: `${signCertPassword}`,
  timestamp: 'http://timestamp.verisign.com/scripts/timstamp.dll'
})
log.info('Sign package - ', 'Package Signed!')
