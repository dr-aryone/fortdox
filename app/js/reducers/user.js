const {fromJS} = require('immutable');

let initialState = fromJS({
  privateKey: '',
  email: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        privateKey: fromJS(action.payload.privateKey),
        email: fromJS(action.payload.email)
      });
    default:
      return state;
  }
};

module.exports = user;
