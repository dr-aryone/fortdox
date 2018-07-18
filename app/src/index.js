import AppContainer from './containers/AppContainer';
const React = require('react');
const config = require('config.json');
const request = require('@edgeguideab/client-request');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
let Provider = ReactRedux.Provider;
const reducer = require('./reducers');
const thunk = require('redux-thunk').default;
let devToolsMiddleware = window.devToolsExtension
  ? window.devToolsExtension()
  : f => f;
let middlewares = Redux.compose(
  Redux.applyMiddleware(thunk),
  devToolsMiddleware
);
const store = Redux.createStore(reducer, {}, middlewares);
const ipcRenderer = window.require('electron').ipcRenderer;
const { autoUpdater } = window.require('electron').remote.require('electron');
const url = window.require('url');
const querystring = window.require('querystring');
let queryParameters = querystring.parse(url.parse(window.location.href).query);
let loginActions = require('./actions/login');

request.bind(`${config.server}/*`, middlewareChain);

function middlewareChain(data) {
  return sessionQueryMiddleWare(versionMiddleware(data));
}

function versionMiddleware({ url, options }) {
  options.headers = options.headers || {};
  options.headers['x-fortdox-version'] = `${config.clientVersion}`;
  return { url, options };
}

function sessionQueryMiddleWare({ url, options }) {
  options.headers = options.headers || {};
  let encodedToken = localStorage.getItem('activeUser');
  options.headers['Authorization'] = `Bearer ${encodedToken}`;
  return {
    url,
    options
  };
}

request.bindResponseMiddleware(oReq => {
  if (oReq.status === 400) {
    const version = oReq.getResponseHeader('x-fortdox-required-version');
    if (version) {
      store.dispatch({ type: 'WRONG_VERSION' });
      autoUpdater.checkForUpdates();
    }
  }

  if (oReq.status === 401) {
    let message;
    try {
      message = JSON.parse(oReq.response);
    } catch (error) {
      message = {};
    }

    if (message.error === 'sessionExpired') {
      let state = store.getState();
      let email = state.user.get('email');
      let organization = state.user.get('organization');
      localStorage.removeItem('activeUser');
      store.dispatch({
        type: 'SESSION_EXPIRED'
      });
      if (email && organization) {
        store.dispatch(loginActions.loginAs(email, organization));
      }
    }
  }
});

if (queryParameters.activateOrganizationCode) {
  store.dispatch({
    type: 'ACTIVATE_ORGANIZATION_CODE_RECIVED',
    payload: queryParameters.activateOrganizationCode
  });
}

if (queryParameters.activateUserCode) {
  store.dispatch({
    type: 'ACTIVATE_USER_CODE_RECIVED',
    payload: queryParameters
  });
}

ipcRenderer.on('activate-organization', (event, data) => {
  store.dispatch({
    type: 'ACTIVATE_ORGANIZATION_CODE_RECIVED',
    payload: data
  });
  event.sender.send('stop', 'stop');
});

ipcRenderer.on('activate-user', (event, data) => {
  store.dispatch({
    type: 'ACTIVATE_USER_CODE_RECIVED',
    payload: data
  });
  event.sender.send('stop', 'stop');
});

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
