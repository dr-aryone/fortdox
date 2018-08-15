const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  shell,
  dialog,
  autoUpdater
} = require('electron');
const path = require('path');
const urlParser = require('url');
const querystring = require('querystring');
const config = require('./src/config.json');
const log = require('electron-log');
log.transports.file.level = 'info';
let win;
let redirectParameters = null;
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

const isSecondInstance = app.makeSingleInstance(commandLine => {
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
});

let menu;

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
        console.error('An error occurred: ', err);
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
          label: `About ${config.name}`,
          click: () => {
            const dialogOps = {
              type: 'none',
              buttons: ['Ok', 'Check for Updates'],
              defaultId: 0,
              title: 'About FortDox',
              message: `FortDox Version ${config.clientVersion}`
            };

            dialog.showMessageBox(win, dialogOps, response => {
              if (response === 1) {
                autoUpdater.checkForUpdates();
              }
            });
          }
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
  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

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

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('outdated-client', () => {
  if (config.autoUpdates) {
    updateDialog();
  }
});

function updateDialog() {
  if (updateInfo.updating) {
    return;
  }

  const dialogOps = {
    type: 'question',
    buttons: ['Update', 'Cancel'],
    defaultId: 0,
    title: 'Outdated version',
    message: 'You use an old version, do you want to update now?'
  };

  dialog.showMessageBox(win, dialogOps, response => {
    if (response === 0) {
      autoUpdater.checkForUpdates();
    }
  });
}

if (config.autoUpdates) {
  const updateFeed = `${config.server}/update/${config.clientVersion}`;
  autoUpdater.setFeedURL(updateFeed);
}

//autoUpdater events
autoUpdater.on('error', error => {
  console.error('Update problem', error);
  const dialogOps = {
    type: 'error',
    buttons: ['Ok'],
    title: 'FortDox Update',
    message: `Error updating application
    ${'' + error}
  `
  };
  updateInfo.updating = false;
  dialog.showMessageBox(dialogOps, response => {});
});

let updateInfo = {
  updatingInternal: false,
  valueListener: function() {
    console.error('You forgot to bind the listener');
  },

  get updating() {
    return this.updatingInternal;
  },
  set updating(change) {
    this.updatingInternal = change;
    this.valueListener(change);
  },

  registerListener: function(listener) {
    this.valueListener = listener;
  }
};

updateInfo.registerListener(function(value) {
  menu.items[0].submenu.items[0].enabled = !value;
});

autoUpdater.on('checking-for-update', () => {
  updateInfo.updating = true;
});

autoUpdater.on('update-available', () => {
  const dialogOps = {
    type: 'info',
    button: ['Ok'],
    title: 'FortDox Update',
    message:
      'Update avaiable! Download will start.\n You will be notified when it is ready.'
  };

  dialog.showMessageBox(win, dialogOps, () => {});
});
autoUpdater.on('update-not-available', () => {
  updateInfo.updating = false;
  const dialogOps = {
    type: 'info',
    buttons: ['Ok'],
    title: 'FortDox Update',
    message: 'No Update Available '
  };

  dialog.showMessageBox(win, dialogOps, () => {});
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOps = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'FortDox Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOps, response => {
    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
    updateInfo.updating = false;
  });
});
