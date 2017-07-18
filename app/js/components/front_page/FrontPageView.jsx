const React = require('react');
const views = require('views.json');
const LoginViewContainer = require('containers/front_page/LoginViewContainer');
const RegisterViewContainer = require('containers/front_page/RegisterViewContainer');
const VerifyUserContainer = require('containers/invite/VerifyUserContainer');
const VerifyLoginContainer = require('containers/front_page/VerifyLoginContainer');

const FrontPageView = ({currentView}) => {
  let view = {};
  switch (currentView) {
    case views.LOGIN_VIEW:
      view = <LoginViewContainer />;
      break;
    case views.VERIFY_LOGIN_VIEW:
      view = <VerifyLoginContainer />;
      break;
    case views.REGISTER_VIEW:
    case views.ACTIVATE_ORGANIZATION_VIEW:
      view = <RegisterViewContainer />;
      break;
    case views.VERIFY_USER_VIEW:
      view = <VerifyUserContainer />;
      break;
  }
  return (
    <div className='full-page'>
      {view}
    </div>
  );
};

module.exports = FrontPageView;
