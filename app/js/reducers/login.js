const {fromJS} = require('immutable');

const initialState = fromJS({
  'email': '',
  'organization': '',
  'passwordInputValue': '',
  'error': false,
  'errorMsg': '',
  'isLoading': false,
  'message': null
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_VERIFY_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'LOGIN_AS':
      return state.merge ({
        'email': fromJS(action.payload.email),
        'organization': fromJS(action.payload.organization)
      });
    case 'VERIFY_LOGIN_CREDS_START':
      return state.set('isLoading', true);
    case 'CHANGE_VIEW':
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_FAIL':
      return state.merge({
        'passwordInputValue': '',
        'error': true,
        'errorMsg': action.payload,
        'isLoading': false
      });
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'REGISTER_ORGANIZATION_NAME_SUCCESS':
      return state.set('message', fromJS(action.payload));
    default:
      return state;
  }
};

module.exports = login;
