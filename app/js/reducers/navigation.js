const {fromJS} = require('immutable');

const initialState = fromJS({
  currentView: 'LOGIN_VIEW',
});

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return state.set('currentView', fromJS(action.payload));
    case 'SET_UPDATE_DOCUMENT':
      return state.set('currentView', fromJS('UPDATE_DOC_VIEW'));
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_SUCCESS':
    case 'CREATE_DOCUMENT_SUCCESS':
      return state.set('currentView', fromJS('USER_VIEW'));
    case 'REGISTER_ORGANIZATION_SUCCESS':
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'VERIFY_NEW_USER_SUCCESS':
    case 'LOGOUT':
      return state.set('currentView', fromJS('LOGIN_VIEW'));
    case 'ACTIVATE_ORGANIZATION_CODE_RECIVED':
      return state.set('currentView', fromJS('ACTIVATE_ORGANIZATION_VIEW'));
    case 'ACTIVATE_USER_CODE_RECIVED':
      return state.set('currentView', fromJS('VERIFY_USER_VIEW'));
    case 'LOGIN_AS':
      return state.set('currentView', fromJS('VERIFY_LOGIN_VIEW'));
    default:
      return state;
  }
};

module.exports = navigation;
