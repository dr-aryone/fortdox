const React = require('react');
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
var ipcRenderer = window.require('electron').ipcRenderer;


ipcRenderer.on('url', (event, arg) => {
  console.log(arg);
});


ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
