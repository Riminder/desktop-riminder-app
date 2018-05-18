const electron = require('electron')

const Menu = electron.Menu
const app = electron.app
const shell = electron.shell

let windowReopener

const DEFAULT_BASE_MENU_TEMPLATE = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    label: 'history',
    submenu: [
      {label: 'back',
        click (menuItem, browserWindow, event) { browserWindow.webContents.goBack() }},
      {label: 'forward',
        click (menuItem, browserWindow, event) { browserWindow.webContents.goForward() }}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {label: app.getName(),
        click () { windowReopener ? windowReopener() : windowReopener = null }},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { shell.openExternal('https://riminder.net') }
      }
    ]
  }
]

const DEFAULT_MAC_TEMPLATE_ADDING = {
  label: app.getName(),
  submenu: [
    {role: 'about'},
    {type: 'separator'},
    {role: 'services', submenu: []},
    {type: 'separator'},
    {role: 'hide'},
    {role: 'hideothers'},
    {role: 'unhide'},
    {type: 'separator'},
    {role: 'quit'}
  ]
}

class MenuUtils {
  static generateDefaultMenuTemplate () {
    let menuTemplate = DEFAULT_BASE_MENU_TEMPLATE
    if (process.platform === 'darwin') {
      menuTemplate.unshift(DEFAULT_MAC_TEMPLATE_ADDING)
    }
    return menuTemplate
  }

  static generateMenu (template) {
    let res = Menu.buildFromTemplate(template)
    return res
  }

  static applyMenu (menu) {
    Menu.setApplicationMenu(menu)
  }

  static applyDefaultMenu () {
    let menuTemplate = MenuUtils.generateDefaultMenuTemplate()
    let menu = MenuUtils.generateMenu(menuTemplate)

    MenuUtils.applyMenu(menu)
  }

  static setWindowReOpener (func) {
    windowReopener = func
  }
}

module.exports = MenuUtils
