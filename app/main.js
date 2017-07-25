const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const config = require('./config.json');
const {systemPreferences} = require('electron');
systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
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
      role: 'selectAll'
    }]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.setAsDefaultProtocolClient(config.name);

app.on('ready', createWindow);

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
