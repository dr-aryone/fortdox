const React = require('react');
const FrontPageViewContainer = require('containers/front_page/FrontPageViewContainer');
const UserViewContainer = require('containers/user/UserViewContainer');
const views = require('views.json');

const App = (prop) => {
  switch (prop.view) {
    case views.VERIFY_USER_VIEW:
    case views.LOGIN_VIEW:
    case views.VERIFY_LOGIN_VIEW:
    case views.REGISTER_VIEW:
    case views.REGISTER_VERIFY_VIEW:
      return <FrontPageViewContainer />;
    case views.INVITE_USER_VIEW:
    case views.SEARCH_VIEW:
    case views.USER_VIEW:
    case views.CREATE_DOC_VIEW:
    case views.UPDATE_DOC_VIEW:
      return <UserViewContainer />;
    default:
      return (<div />);
  }
};

module.exports = App;
