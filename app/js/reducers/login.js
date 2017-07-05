const {fromJS} = require('immutable');

const initialState = fromJS({
  'emailInputValue': '',
  'passwordInputValue': '',
  'error': false,
  'errorMsg': '',
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_FAIL':
      return state.merge({
        'emailInputValue': '',
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
