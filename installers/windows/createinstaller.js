// Script that create installer

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const commandLineArgs = require('command-line-args')
const log = require('electron-log')
const path = require('path')

let args = commandLineArgs([
  {name: 'cert-path', type: String, defaultOption: true},
  {name: 'cert-passw', type: String, defaultValue: '""'}], { camelCase: true })

let signCertPath = args.certPath
let signCertPassword = args.certPassw

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  let option = {
    appDirectory: path.join(outPath, 'riminder-win32-ia32/'),
    authors: 'Riminder',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'riminder.exe',
    setupExe: 'RiminderAppInstaller.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
  }
  if ((signCertPath === undefined || signCertPassword === undefined) && signCertPath !== signCertPassword) {
    log.error('createinstaller-win', 'Certs datas are invalid, no signature')
  }
  if (signCertPath !== undefined && signCertPassword !== undefined) {
    option.signWithParams = `/t http://timestamp.verisign.com/scripts/timstamp.dll /f "${path.resolve(signCertPath)}" /p ${signCertPassword}`
  }
  return Promise.resolve(option)
}
