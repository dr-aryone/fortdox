const {fromJS} = require('immutable');

const initialState = fromJS({
  email: '',
  organization: '',
  password: '',
  error: null,
  isLoading: false,
  message: null,
  warning: null
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_VERIFY_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'LOGIN_AS':
      return state.merge ({
        email: fromJS(action.payload.email),
        organization: fromJS(action.payload.organization)
      });
    case 'SESSION_EXPIRED':
      return state.set('warning', 'Session expired, please login again');
    case 'VERIFY_LOGIN_CREDS_START':
      return state.set('isLoading', true)
        .set('warning', null)
        .set('error', null);
    case 'CHANGE_VIEW':
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_FAIL':
      return state.merge({
        password: '',
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'VERIFY_NEW_USER_SUCCESS':
      return state.set('message', fromJS(action.payload.message));
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'REGISTER_ORGANIZATION_SUCCESS':
      return state.set('message', fromJS(action.payload));
    default:
      return state;
  }
};

module.exports = login;
