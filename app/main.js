const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const config = require('./config.json');
const autoUpdater = require('electron-updater').autoUpdater;
const log = require('electron-log');
log.transports.file.level = 'info';
let win;
let redirectParameters = null;
autoUpdater.logger = log;
let dev_mode = false;
let openWindow = false;
let pollingJob;
dev_mode = (process.argv[2] === '--dev') ? true : false;
app.setAsDefaultProtocolClient(config.name);

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  pollingJob = setInterval(() => {
    if (process.platform === 'win32' && commandLine[1] !== undefined) {
      let url = commandLine[1];
      redirectParameters = setActivationParams(url);
      switch (redirectParameters.type) {
        case 'organization':
          activateOrganization(redirectParameters.code);
          break;
        case 'user':
          activateUser(url);
      }
    }
  }, 1000);
  if (openWindow) {
    win.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

//If application opened from URL then this event will fire before 'ready' event.
app.on('open-url', (event, url) => {
  redirectParameters = setActivationParams(url);
  if (openWindow) {
    switch (redirectParameters.type) {
      case 'organization':
        activateOrganization(redirectParameters.code);
        break;
      case 'user':
        activateUser(url);
    }
  }
});

app.on('ready', () => {
  createBrowserWindow();
  // if (dev) {
  //   autoUpdater.setFeedURL(`${config.server}/downloads?version=${app.getVersion()}&platform=${process.platform}`);
  //   autoUpdater.checkForUpdates();
  // }
});

function createBrowserWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: path.join(__dirname, config.logo)
  });
  if (dev_mode) {
    win.webContents.openDevTools();
    installExtension(REDUX_DEVTOOLS);
  }
  openWindow = true;

  let openingUrl = urlParser.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  });


  openingUrl += '?';
  if (redirectParameters) {
    switch (redirectParameters.type) {
      case 'organization':
        openingUrl += `activateOrganizationCode=${redirectParameters.code}`;
        break;
      case 'user':
        openingUrl += `activateUserCode=${redirectParameters.code}`;
    }
  }
  openingUrl += `&downloadDirectory=${encodeURIComponent(app.getPath('downloads'))}`;
  win.loadURL(openingUrl);

  var template = [{
    label: 'Application',
    submenu: [{
      label: `About ${config.name}`,
      role: 'orderFrontStandardAboutPanel'
    }, {
      label: 'Refresh',
      accelerator: 'CmdOrCtrl+R',
      role: 'reload'
    }, {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.quit();
      }
    }]}, {
      label: 'Edit',
      submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Y',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.on('closed', () => {
    win = null;
  });
}

const setActivationParams = url => {
  let redirectParameters = {
    type: '',
    code: null
  };
  redirectParameters.type = redirectParameters.type = urlParser.parse(url).hostname.split('.')[1];
  redirectParameters.code = querystring.parse(urlParser.parse(url).query).code;
  return redirectParameters;
};

const activateOrganization = code => {
  win.webContents.send('activate-organization', code);
  win.focus();
};

const activateUser = url => {
  let userToActivate = querystring.parse(urlParser.parse(url).query);
  win.webContents.send('activate-user', userToActivate);
  win.focus();
};


pollingJob = setInterval(() => {
  if (process.platform === 'win32' && process.argv[1] !== undefined) {
    let url = process.argv[1];
    redirectParameters = setActivationParams(url);
    switch (redirectParameters.type) {
      case 'organization':
        activateOrganization(redirectParameters.code);
        break;
      case 'user':
        activateUser(url);
    }
  }
}, 100);


ipcMain.on('stop', () => {
  clearInterval(pollingJob);
});

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for updates..');
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available!! \n' + JSON.stringify(info));
});

autoUpdater.on('update-not-available', () => {
  log.info('No update available');
});

autoUpdater.on('update-downloaded', (event, info) => {
  log.info('Update downloaded!! \n' + info);
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  app.quit();
});
