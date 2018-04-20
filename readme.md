### Riminder's desktop app

*A desktop app for riminder*

____

Riminder's desktop-app will allow you to keep in touch with every talent on our
platform, you will never miss any of them.

Package

You can generate an installer for linux, windows and mac os using npm:
* Windows:
  * Rename `package_win.json` to `package.json`
  * Execute:
    * `npm install`
    * `npm run package-win`
    * `npm run sign-win-package -- [args]` (to sign the app)
    * `npm run create-win-installer -- [args]` (to sign the app)

  * sign-win-package args:
    * `--cert-path path/to/certificate` set certificate's path
    * `--cert-passw 12345_is_a_good_password` set certificate's password
  * create-win-installer args:
    * `--cert-path path/to/certificate` set certificate's path
    * `--cert-passw 12345_is_a_good_password` set certificate's password

* Linux:
  * Execute:
    * `npm install`
    * `npm run package-linux`
    * `npm run create-deb-installer`


* Mac os:
  * Execute:
    * `npm install`
    * `npm run package-macos`
    * `npm run create-mac-installer`

You can be found in `release-builds`, then you can now (hopefully) install the app !

*This app has been created using [electron](https://github.com/electron/electron)*
