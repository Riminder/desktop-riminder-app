### Riminder's desktop app

*A desktop app for riminder*

____

Riminder's desktop-app will allow you to keep in touch with every talent on our
platform, you will never miss any of them.

You should use [yarn](https://yarnpkg.com/en/) for dependencies management

Package the app:

You can generate a package and an installer for macOS, windows and linux:

* On macOS (.dmg):
  * Execute: `npm run releaseMac -- path/to/certificate.p12`
* On windows (.appx for windows store)
  * Change certificate datas to match yours in `package.json` see [electron-builder documentation](https://www.electron.build/configuration/win) for more infos
  * Execute `npm run dist`
* On linux (.deb):
    * Execute: `npm run dist`

Your packages and your installers can be found in `dist` directory, then you can (hopefully) install the app !

*This app has been created using [electron](https://github.com/electron/electron)*
