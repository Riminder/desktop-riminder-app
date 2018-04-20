const path = require('path')
const commandLineArgs = require('command-line-args')
const cmd = require('node-cmd')

let args = commandLineArgs([
  {name: 'certPath', type: String},
  {name: 'certPassw', type: String},
  {name: 'exe', type: String}
])

let signCertPath
let signCertPassword

signCertPath = args.certPath
signCertPassword = args.certPassw

cmd.run(`
  npm run package-win
  signtool sign /t http://timestamp.verisign.com/scripts/timstamp.dll /f "${path.resolve(signCertPath)}" /p ${signCertPassword} release-builds/riminder-win32-ia32/riminder.exe`)
