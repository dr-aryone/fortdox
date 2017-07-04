const React = require('react');
const views = require('views.json');
const LoginViewContainer = require('containers/front_page/LoginViewContainer');
const RegisterViewContainer = require('containers/front_page/RegisterViewContainer');

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
