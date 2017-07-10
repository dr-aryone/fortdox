const {app, BrowserWindow} = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
let win;
let activationCode;

async function createWindow() {
  win = new BrowserWindow({width: 1280, height: 720});
  win.webContents.openDevTools();
  installExtension(REDUX_DEVTOOLS);

  let openingUrl = urlParser.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });
  if (activationCode) {
    openingUrl = `${openingUrl}?activationCode=${activationCode}`;
  }
  win.loadURL(openingUrl);

  win.on('closed', () => {
    win = null;
  });
}

app.setAsDefaultProtocolClient('FortDoks');
app.on('ready', createWindow);

app.on('open-url', (event, url) => {
  activationCode = querystring.parse(urlParser.parse(url).query).code;
  if (win !== undefined) {
    win.webContents.send('url', activationCode);
    win.show();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
