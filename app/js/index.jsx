const React = require('react');
const ReactDOM = require('react-dom');
const Redux = require('redux');
const ReactRedux = require('react-redux');
let Provider = ReactRedux.Provider;
const reducer = require('./reducers');
const App = require('./components/App');
const thunk = require('redux-thunk').default;
let devToolsMiddleware = window.devToolsExtension ? window.devToolsExtension() : f => f;
let middlewares = Redux.compose(Redux.applyMiddleware(thunk), devToolsMiddleware);

const store = Redux.createStore(reducer, {}, middlewares);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
