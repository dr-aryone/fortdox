const React = require('react');
const LoginViewContainer = require('containers/LoginViewContainer');
const UserViewContainer = require('containers/UserViewContainer');
const RegisterViewContainer = require('containers/RegisterViewContainer');
const FormViewContainer = require('containers/FormViewContainer');
const SearchViewContainer = require('containers/SearchViewContainer');

const App = (prop) => {
  switch (prop.view) {
    case 'LOGIN_VIEW':
      return (<div><LoginViewContainer /></div>);
    case 'USER_VIEW':
      return (<div><UserViewContainer /></div>);
    case 'REGISTER_VIEW':
      return (<div><RegisterViewContainer /></div>);
    case 'SEARCH_VIEW':
      return (<div><SearchViewContainer /></div>);
    case 'FORM_VIEW':
      return (<div><FormViewContainer /></div>);
    default:
      return (<div />);
  }
};

module.exports = App;
