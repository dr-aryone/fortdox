const React = require('react');
const views = require('views.json');
const LoginViewContainer = require('containers/front_page/LoginViewContainer');
const RegisterViewContainer = require('containers/front_page/RegisterViewContainer');
const VerifyUserContainer = require('containers/invite/VerifyUserContainer');

const FrontPageView = ({currentView}) => {
  let view = {};
  switch (currentView) {
    case views.LOGIN_VIEW:
      view = <LoginViewContainer />;
      break;
    case views.REGISTER_VIEW:
    case views.REGISTER_VERIFY_VIEW:
      view = <RegisterViewContainer />;
      break;
    case views.VERIFY_USER_VIEW:
      view = <VerifyUserContainer />;
      break;
  }

  return (
    <div className='login-outer'>
      <div className='login-middle'>
        {view}
      </div>
    </div>
  );
};

module.exports = FrontPageView;
