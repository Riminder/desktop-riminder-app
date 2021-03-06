# Riminder's desktop app

Riminder's desktop-app will allow you to keep in touch with every talent on our platform, you will never miss any of them.

This app has been created using [electron](https://github.com/electron/electron)

## Code

electron-pdf-window v1.0.12 can't handle links with paramatres. v1.0.10 is mandated in the dependencies.

You should use [yarn](https://yarnpkg.com/en/) for dependencies management.

Install the dependencies with:

``` bash
npm install
```

### Package the app

You can generate a package and an installer for macOS, windows and linux:

* On macOS (.dmg):
  * Execute: `npm run releaseMac -- path/to/certificate.p12`
* On windows (.appx for windows store)
  * Change certificate datas to match yours in `package.json` see [electron-builder documentation](https://www.electron.build/configuration/win) for more infos
  * Execute `npm run dist`
* On linux (.deb):
  * Execute:

  ``` bash
  npm run dist
  ```

Your packages and your installers can be found in `dist` directory, then you can install the app using gdebi or snap!
you can also directly run it with :
```bash
npm start
```