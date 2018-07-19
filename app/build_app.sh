npm run build
electron-packager . --icon public/resources/logo.icns --app-bundle-id com.edgeguide.fortdox --overwrite
codesign --deep --force --verbose --sign "Mac Developer: David Skeppstedt (SQM8QGLKG8)" FortDox-darwin-x64/FortDox.app
read -p "Enter version number, e.g 1.0: " versionNumber
zip -9 -q -r FortDox-darwin-x64/fortdox-$versionNumber.zip FortDox-darwin-x64/FortDox.app/
echo 'Done!'