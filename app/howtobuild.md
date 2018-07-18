To build FortDox.app you need to do the following:  

* First run  `npm run build` to create the correct react build.
* package the app running `electron-packager . --icon public/resources/logo.icns --app-bundle-id com.edgeguide.fortdox --overwrite`
* signing the app `codesign --deep --force --verbose --sign "Mac Developer: David Skeppstedt (SQM8QGLKG8)" FortDox.app`

This is a runnable FortDox.app that is signed with either a development cert or a production certifacte depending on what you pass to --sign.

To prepare the new FortDox.app file for release do the following:
* Before everything, dont forget to update clientVersion on both client and server. If you forgot, scrap everything and start over.
* Take the new Fortdox.app and createa a zip archive of it.
* Place the zip in the servers public folder.
* Restart server to let new config of client version take effect.


Know problems:
* This does not work in development due to not running signd version of our app.
* After the prompt to update appears and you press restart it take approximatildy 30 sec without any feedback before it relanuches the updated version.
* If an update fails, you need to restart FortDox before we can try downloading again.