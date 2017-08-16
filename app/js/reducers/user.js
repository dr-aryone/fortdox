const {fromJS} = require('immutable');

let initialState = fromJS({
  privateKey: '',
  email: '',
  organization: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        email: fromJS(action.payload.email),
        organization: fromJS(action.payload.organization)
      });
    case 'LOGOUT':
      localStorage.removeItem(state.get('email'));
      return initialState;
    default:
      return state;
  }
};

module.exports = user;
