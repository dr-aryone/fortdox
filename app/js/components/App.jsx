const React = require('react');
const LoginViewContainer = require('containers/login/LoginViewContainer');
const UserViewContainer = require('containers/user/UserViewContainer');
const RegisterViewContainer = require('containers/register/RegisterViewContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const views = require('views.json');

const App = (prop) => {
  switch (prop.view) {
    case views.LOGIN_VIEW:
      return (<div><LoginViewContainer /></div>);
    case views.USER_VIEW:
      return (<div><UserViewContainer /></div>);
    case views.REGISTER_VIEW:
      return (<div><RegisterViewContainer /></div>);
    case views.SEARCH_VIEW:
      return (<div><SearchViewContainer /></div>);
    case views.CREATE_DOC_VIEW:
      return (<div><CreateDocContainer /></div>);
    case views.UPDATE_DOC_VIEW:
      return (<div><UpdateDocContainer /></div>);
    default:
      return (<div />);
  }
};

module.exports = App;
