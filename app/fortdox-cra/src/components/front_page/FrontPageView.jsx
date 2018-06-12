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
    case 'VERIFY_USER_VIEW':
      view = <VerifyUserContainer />;
      break;
    case 'REGISTER_VIEW':
    case 'ACTIVATE_ORGANIZATION_VIEW':
    default:
      view = <RegisterViewContainer />;
      break;
  }
  return <div className='full-page'>{view}</div>;
}
