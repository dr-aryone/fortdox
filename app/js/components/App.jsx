const React = require('react');
const LoginViewContainer = require('../containers/LoginViewContainer');
const UserViewContainer = require('../containers/userViewContainer');

const App = (prop) => {
  switch (prop.view) {
    case 'LOGIN_VIEW':
      return (<div><LoginViewContainer /></div>);
    case 'USER_VIEW':
      return (<div><UserViewContainer /></div>);
    default:
      return (<div />);
  }
};

module.exports = App;
