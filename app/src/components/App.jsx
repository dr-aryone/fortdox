import FrontPageViewContainer from '../containers/front_page/FrontPageViewContainer';
import UserViewContainer from '../containers/user/UserViewContainer';
const React = require('react');
const SplashScreen = require('components/general/SplashScreen');
const Toast = require('components/general/Toast');

const App = ({ currentView, splashScreen }) => {
  let view = null;
  switch (currentView) {
    case 'INVITE_VIEW':
    case 'VERIFY_USER_VIEW':
    case 'VERIFY_INVITE_VIEW':
    case 'LOGIN_VIEW':
    case 'VERIFY_LOGIN_VIEW':
    case 'REGISTER_VIEW':
    case 'ACTIVATE_ORGANIZATION_VIEW':
    case 'VERIFY_ORGANIZATION_VIEW':
      view = <FrontPageViewContainer />;
      break;
    case 'DEVICES_VIEW':
    case 'INVITE_USER_VIEW':
    case 'SEARCH_VIEW':
    case 'USER_VIEW':
    case 'CREATE_DOC_VIEW':
    case 'UPDATE_DOC_VIEW':
    case 'PREVIEW_DOC':
    default:
      view = <UserViewContainer />;
      break;
  }
  return (
    <div>
      <SplashScreen show={splashScreen} />
      {view}
      <Toast />
    </div>
  );
};

export default App;
