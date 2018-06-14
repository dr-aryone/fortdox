const React = require('react');
const LoginViewContainer = require('containers/front_page/LoginViewContainer');
const RegisterViewContainer = require('containers/front_page/RegisterViewContainer');
const VerifyUserContainer = require('containers/invite/VerifyUserContainer');
const VerifyLoginContainer = require('containers/front_page/VerifyLoginContainer');

const FrontPageView = ({ currentView }) => {
  let view = {};
  switch (currentView) {
    case 'LOGIN_VIEW':
      view = <LoginViewContainer />;
      break;
    case 'VERIFY_LOGIN_VIEW':
      view = <VerifyLoginContainer />;
      break;
    case 'REGISTER_VIEW':
    case 'ACTIVATE_ORGANIZATION_VIEW':
    case 'VERIFY_ORGANIZATION_VIEW':
      view = <RegisterViewContainer />;
      break;
    case 'INVITE_VIEW':
    case 'VERIFY_USER_VIEW':
    case 'VERIFY_INVITE_VIEW':
      view = <VerifyUserContainer />;
      break;
  }
  return <div className='full-page'>{view}</div>;
};

module.exports = FrontPageView;
