const {fromJS} = require('immutable');

const initialState = fromJS({
  userInputValue: '',
  passwordInputValue: '',
  username: ''
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_LOGIN':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        'userInputValue': '',
        'passwordInputValue': '',
        'username': fromJS(action.payload.username)
      });
    case 'VERIFY_LOGIN_CREDS_FAIL':
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return state;
  }
};

module.exports = login;
