const path = require('path')
const commandLineArgs = require('command-line-args')
const childProcess = require('child_process')
const log = require('log')

let args = commandLineArgs([
  {name: 'cert-path', type: String, defaultOption: true},
  {name: 'cert-passw', type: String, defaultValue: '""'}], { camelCase: true })

let signCertPath
let signCertPassword

signCertPath = args.certPath
signCertPassword = args.certPassw

let createPack = childProcess.spawnSync('npm', ['run', 'package-win'], {stdio: 'inherit'})
// createPack.on('error', function (err) {
//   if (err) {
//     throw err
//   }
// })
// createPack.on('close', function () {
//   log.info('Package created!')
// })

let signPack = childProcess.spawnSync('signtool', ['sign',
  '/t', 'http://timestamp.verisign.com/scripts/timstamp.dll',
  '/f', `"${path.resolve(signCertPath)}"`,
  '/p', `${signCertPassword}`,
  'release-builds/riminder-win32-ia32/riminder.exe'], {stdio: 'inherit'})
// signPack.on('error', function (err) {
//   throw err
// })
// signPack.on('close', function () {
//   log.info('Package created!')
// })
