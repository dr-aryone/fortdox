npm run build
electron-packager . --icon public/resources/logo.icns --app-bundle-id com.edgeguide.fortdox --overwrite
codesign --deep --force --verbose --sign "Mac Developer: David Skeppstedt (SQM8QGLKG8)" FortDox-darwin-x64/FortDox.app
zip -9 -r FortDox-darwin-x64/test.zip FortDox-darwin-x64/FortDox.app/
echo 'Done!'