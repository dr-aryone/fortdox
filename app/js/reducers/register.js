const {fromJS} = require('immutable');

const initialState = fromJS({
  userInputValue: '',
  passwordInputValue: '',
  username: ''
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      if (action.name === 'userInput') return state.set('userInputValue', fromJS(action.value));
      else if (action.name === 'passwordInput') return state.set('passwordInputValue', fromJS(action.value));
      return state;
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.set('username', fromJS(action.payload.username));
    case 'VERIFY_LOGIN_CREDS_FAIL':
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return state;
  }
};

module.exports = register;
