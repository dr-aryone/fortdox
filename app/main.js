const {app, BrowserWindow} = require('electron')
const requestor = require('@edgeguideab/requestor')
const path = require('path')
const url = require('url')

let win

async function createWindow() {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
