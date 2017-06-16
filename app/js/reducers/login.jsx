const initialState = {
  userInputValue: '',
  passwordInputValue: ''
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      if (action.name === 'userInput') {
        return {
          input: {
            userInputValue: action.value
          }
        };
      } else if (action.name === 'passwordInput') {
        return {
          input: {
            passwordInputValue: action.value
          }
        };
      }
      return state;
    case 'VERIFY_LOGIN_CREDS_DONE':
      return {
        user: action.payload.user
      };
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return state;
  }
};

module.exports = login;
