const {fromJS} = require('immutable');

const initialState = fromJS({
  userInputValue: '',
  passwordInputValue: ''
});

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      if (action.name === 'userInput') return state.set('userInputValue', fromJS(action.value));
      else if (action.name === 'passwordInput') return state.set('passwordInputValue', fromJS(action.value));
      return state;
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state = state.update('user', fromJS(action.payload.user));
    case 'VERIFY_LOGIN_CREDS_FAIL':
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return state;
  }
};

module.exports = login;
