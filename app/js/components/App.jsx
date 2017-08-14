const React = require('react');
const FrontPageViewContainer = require('containers/front_page/FrontPageViewContainer');
const UserViewContainer = require('containers/user/UserViewContainer');

const App = (prop) => {
  switch (prop.view) {
    case 'VERIFY_USER_VIEW':
    case 'LOGIN_VIEW':
    case 'VERIFY_LOGIN_VIEW':
    case 'REGISTER_VIEW':
    case 'ACTIVATE_ORGANIZATION_VIEW':
      return <FrontPageViewContainer />;
    case 'INVITE_USER_VIEW':
    case 'SEARCH_VIEW':
    case 'USER_VIEW':
    case 'CREATE_DOC_VIEW':
    case 'UPDATE_DOC_VIEW':
      return <UserViewContainer />;
    default:
      return (<div />);
  }
};

module.exports = App;
