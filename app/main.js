const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const config = require('./config.json');
const autoUpdater = require('electron-updater').autoUpdater;
const log = require('electron-log');
log.transports.file.level = 'info';
let win;
let redirectParameters = null;
autoUpdater.logger = log;
let openWindow = false;
let pollingJob;
const devMode = process.argv[2] === '--dev' ? true : false;
let devtools = {};
if (devMode) {
  devtools = require('electron-devtools-installer');
}
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} = devtools;
app.setAsDefaultProtocolClient(config.name);

const isSecondInstance = app.makeSingleInstance(
  (commandLine, workingDirectory) => {
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
  }
);

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
  if (devMode) {
    win.webContents.openDevTools();
    installExtension(REDUX_DEVTOOLS);
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension:  ${name}`);
      })
      .catch(err => {
        console.log('An error occurred: ', err);
      });
  }
  openWindow = true;

  let openingUrl =
    process.env.ELECTRON_START_URL ||
    urlParser.format({
      pathname: path.join(__dirname, './build/index.html'),
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
  openingUrl += `&downloadDirectory=${encodeURIComponent(
    app.getPath('downloads')
  )}`;
  win.loadURL(openingUrl);

  win.webContents.on('will-navigate', handleRedirect);
  win.webContents.on('new-window', handleRedirect);

  const template = [
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'pasteandmatchstyle'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: []
    }
  ];

  if (process.platform === 'darwin') {
    const name = config.name;
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    });

    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ];
  }

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
  redirectParameters.type = redirectParameters.type = urlParser
    .parse(url)
    .hostname.split('.')[1];
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

function handleRedirect(e, url) {
  if (url !== win.webContents.getURL()) {
    e.preventDefault();
    shell.openExternal(url);
  }
}

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

autoUpdater.on('update-available', info => {
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
