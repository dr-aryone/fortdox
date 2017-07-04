const React = require('react');
const FrontPageViewContainer = require('containers/front_page/FrontPageViewContainer');
const UserViewContainer = require('containers/user/UserViewContainer');
const views = require('views.json');

const App = (prop) => {
  switch (prop.view) {
    case views.LOGIN_VIEW:
    case views.REGISTER_VIEW:
    case views.REGISTER_VERIFY_VIEW:
      return (<div><FrontPageViewContainer /></div>);
    case views.SEARCH_VIEW:
    case views.USER_VIEW:
    case views.CREATE_DOC_VIEW:
    case views.UPDATE_DOC_VIEW:
      return (<div><UserViewContainer /></div>);
    default:
      return (<div />);
  }
};

module.exports = App;
