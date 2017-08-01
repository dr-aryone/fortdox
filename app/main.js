const {app, BrowserWindow} = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const config = require('./config.json');
const autoUpdater = require('electron-updater').autoUpdater;
const log = require('electron-log');
log.transports.file.level = 'info';
let win;
let activation = {
  type: '',
  code: null
};



async function createWindow() {
  win = new BrowserWindow({width: 1280, height: 720});
  win.webContents.openDevTools();
  installExtension(REDUX_DEVTOOLS);

  let openingUrl = urlParser.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  });

  if (activation.code) {
    switch (activation.type) {
      case 'activate.organization':
        openingUrl = `${openingUrl}?activateOrganizationCode=${activation.code}`;
        break;
      case 'activate.user':
        openingUrl = `${openingUrl}?activateUserCode=${activation.code}`;
    }
  }

  win.loadURL(openingUrl);

  win.on('closed', () => {

    win = null;
  });
}


app.setAsDefaultProtocolClient(config.name);

app.on('ready',  () => {
  createWindow();
  autoUpdater.checkForUpdates();
  autoUpdater.setFeedURL(`http://localhost:8000/updater?version=${app.getVersion()}&platform=${process.platform}`);
});

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for updates..');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available!! \n' + info);
  autoUpdater.downloadUpdate();
});

autoUpdater.on('update-not-available', () => {
  log.info('No update available');
});

autoUpdater.on('update-downloaded', (event, info) => {
  log.info('Update downloaded!! \n' + info);
  autoUpdater.quitAndInstall();
});
app.on('open-url', (event, url) => {
  activation.type = urlParser.parse(url).hostname;
  activation.code = querystring.parse(urlParser.parse(url).query).code;
  let activateUser = querystring.parse(urlParser.parse(url).query);
  if (win !== undefined) {
    if (activation.type === 'activate.organization') {
      win.webContents.send('activate-organization', activation.code);
      win.show();
    } else if (activation.type === 'activate.user') {
      win.webContents.send('activate-user', activateUser);
      win.show();
    }
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
