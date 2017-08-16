const React = require('react');
const config = require('../config.json');
const request = require('@edgeguideab/client-request');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
let Provider = ReactRedux.Provider;
const reducer = require('./reducers');
const AppContainer = require('./containers/AppContainer');
const thunk = require('redux-thunk').default;
let devToolsMiddleware = window.devToolsExtension ? window.devToolsExtension() : f => f;
let middlewares = Redux.compose(Redux.applyMiddleware(thunk), devToolsMiddleware);
const store = Redux.createStore(reducer, {}, middlewares);
const ipcRenderer = window.require('electron').ipcRenderer;
const url = window.require('url');
const querystring = window.require('querystring');
let queryParameters = querystring.parse(url.parse(window.location.href).query);

request.bind(`${config.server}/*`, sessionQueryMiddleWare);

function sessionQueryMiddleWare({url, options}) {
  options.headers = options.headers || {};
  let encodedToken = localStorage.getItem('activeUser');
  options.headers['Authorization'] = `Bearer ${encodedToken}`;
  return {
    url,
    options
  };
}

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
