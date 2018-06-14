const { fromJS } = require('immutable');

const initialState = fromJS({
  currentView: 'LOGIN_VIEW',
  splashScreen: true
});

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return state.set('currentView', fromJS(action.payload));
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
    case 'DIRECT_LOGIN_SUCCESS':
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_ERROR':
    case 'CREATE_DOCUMENT_SUCCESS':
      return state
        .set('currentView', fromJS('USER_VIEW'))
        .set('splashScreen', false);
    case 'PREVIEW_DOCUMENT_SUCCESS':
      return state.set('currentView', fromJS('PREVIEW_DOC'));
    case 'REGISTER_ORGANIZATION_SUCCESS':
      return state.set('currentView', fromJS('VERIFY_ORGANIZATION_VIEW'));
    case 'VERIFY_ACTIVATION_CODE_ERROR':
      return state.set('currentView', fromJS('VERIFY_ORGANIZATION_VIEW'));
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'VERIFY_NEW_USER_SUCCESS':
    case 'LOGOUT':
    case 'DIRECT_LOGIN_FAILED':
    case 'SESSION_EXPIRED':
    case 'FORCE_BACK':
      return state
        .set('currentView', fromJS('LOGIN_VIEW'))
        .set('splashScreen', false);
    case 'VERIFY_ACTIVATION_CODE_SUCCESS':
    case 'ACTIVATE_ORGANIZATION_CODE_RECIVED':
      return state.set('currentView', fromJS('ACTIVATE_ORGANIZATION_VIEW'));
    case 'ACTIVATE_USER_CODE_RECIVED':
      return state.set('currentView', fromJS('VERIFY_USER_VIEW'));
    case 'LOGIN_AS':
      return state.set('currentView', fromJS('VERIFY_LOGIN_VIEW'));
    case 'RECEIVE_PRIVATE_KEY_SUCCESS':
      return state.set('currentView', fromJS('VERIFY_USER_VIEW'));
    case 'RECEIVE_PRIVATE_KEY_ERROR':
      return state.set('currentView', fromJS('INVITE_VIEW'));
    default:
      return state;
  }
};

module.exports = navigation;
