### Riminder's desktop app

*A desktop app for riminder*

____

Riminder's desktop-app will allow you to keep in touch with every talent on our
platform, you will never miss any of them.

Commands:

  * `npm dist`


Package the app:

You can generate a package and an installer for macOS, windows and linux:

* On macOS (.dmg):
  * Execute: `npm dist`
* On windows (.appx for windows store)
  * Change certificate datas to match yours in `package.json` see [electron-builder documentation](https://www.electron.build/configuration/win) for more infos
  * Execute `npm dist`
* On linux (.deb):
    * Execute: `npm dist`

Your packages and your installers can be found in `dist` directory, then you can (hopefully) install the app !

*This app has been created using [electron](https://github.com/electron/electron)*
