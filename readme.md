### Riminder's desktop app

*A desktop app for riminder*

____

Riminder's desktop-app will allow you to keep in touch with every talent on our
platform, you will never miss any of them.

Commands:

  * package_win.json
    *  `npm run package-win`
      * Create a windows package with the app's .exe in it
    * `npm run sign-win-package -- [args]`
      * Sign the app's .exe with the certificate in parameters
      * Args:
        * `--cert-path path/to/certificate` set certificate's path
        * `--cert-passw 12345_is_a_good_password` set certificate's password
    * `npm run create-win-installer -- [args]`
      * Create a windows installer for the app, can be sign using args
      * Args:
        * `--cert-path path/to/certificate` set certificate's path
        * `--cert-passw 12345_is_a_good_password` set certificate's password
    * package.json
      * `npm run package-linux`
        * Create a linux package with app's executable in it
      * `npm run create-deb-installer`
       * Create a .deb package to install the app
      * `npm run package-macos`
        * Create a mac OSX package with app's executable in it
      * `npm run create-mac-installer`
        * Create a .dmg package to install the app


Package the app:

You can generate an installer for linux, windows and mac os using npm:
* Windows:
  * Rename `package_win.json` to `package.json`
  * Execute:
    * `npm install`
    * `npm run package-win`
    * `npm run sign-win-package -- --cert-path path/to/certificate --cert-passw 12345_is_a_good_password`
    * `npm run create-win-installer -- --cert-path path/to/certificate --cert-passw 12345_is_a_good_password`


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

You can be found in `release-builds`, then you can (hopefully) install the app !

*This app has been created using [electron](https://github.com/electron/electron)*
