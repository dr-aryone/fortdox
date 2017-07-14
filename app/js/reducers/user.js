const {fromJS} = require('immutable');

let initialState = fromJS({
  privateKey: '',
  email: '',
  organization: '',
  username: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        privateKey: fromJS(action.payload.privateKey),
        email: fromJS(action.payload.email),
        username: fromJS(action.payload.username),
        organization: fromJS(action.payload.organization)
      });
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

module.exports = user;
