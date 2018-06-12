import LoginViewContainer from 'containers/front_page/LoginViewContainer';
import RegisterViewContainer from 'containers/front_page/RegisterViewContainer';
import VerifyLoginContainer from 'containers/front_page/VerifyLoginContainer';
const React = require('react');
const VerifyUserContainer = require('containers/invite/VerifyUserContainer');

export default function FrontPageView({ currentView }) {
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
    default:
      view = <RegisterViewContainer />;
      break;
  }
  return <div className='full-page'>{view}</div>;
}

module.exports = FrontPageView;
