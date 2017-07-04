const {fromJS} = require('immutable');

const initialState = fromJS({
  'userInputValue': '',
  'passwordInputValue': '',
  'username': '',
  'error': false,
  'errorMsg': '',
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        'userInputValue': '',
        'passwordInputValue': '',
        'username': fromJS(action.payload.username),
        'error': false,
        'errorMsg': ''
      });
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_FAIL':
      return state.merge({
        'userInputValue': '',
        'passwordInputValue': '',
        'error': true,
        'errorMsg': action.payload
      });
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return state;
  }
};

module.exports = login;
