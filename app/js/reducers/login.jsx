const login = (state, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_DONE':
      return {
        user: action.payload.user
      };
    case 'VERIFY_LOGIN_CREDS_ERROR':
    case 'VERIFY_LOGIN_CREDS_START':
    default:
      return {
        user: undefined
      };
  }
};

module.exports = login;
