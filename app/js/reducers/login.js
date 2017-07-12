const {fromJS} = require('immutable');

const initialState = fromJS({
  'emailInputValue': '',
  'passwordInputValue': '',
  'error': false,
  'errorMsg': '',
  'isLoading': false,
  'message': null
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_LOGIN_CREDS_START':
      return state.set('isLoading', true);
    case 'CHANGE_VIEW':
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_FAIL':
      return state.merge({
        'emailInputValue': '',
        'passwordInputValue': '',
        'error': true,
        'errorMsg': action.payload,
        'isLoading': false
      });
    case 'VERIFY_NEW_USER_SUCCESS':
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'REGISTER_ORGANIZATION_NAME_SUCCESS':
      return state.set('message', fromJS(action.payload));
    default:
      return state;
  }
};

module.exports = login;
