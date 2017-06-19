const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

let win;

async function createWindow() {

  win = new BrowserWindow({width: 1280, height: 960});
  installExtension(REDUX_DEVTOOLS);

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
