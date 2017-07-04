const React = require('react');
const LoginViewContainer = require('containers/login/LoginViewContainer');
const UserViewContainer = require('containers/user/UserViewContainer');
const RegisterViewContainer = require('containers/register/RegisterViewContainer');
const views = require('views.json');

const App = (prop) => {
  switch (prop.view) {
    case views.LOGIN_VIEW:
      return (<div><LoginViewContainer /></div>);
    case views.SEARCH_VIEW:
    case views.USER_VIEW:
    case views.CREATE_DOC_VIEW:
    case views.UPDATE_DOC_VIEW:
      return (<div><UserViewContainer /></div>);
    case views.REGISTER_VIEW:
      return (<div><RegisterViewContainer /></div>);
    default:
      return (<div />);
  }
};

module.exports = App;
