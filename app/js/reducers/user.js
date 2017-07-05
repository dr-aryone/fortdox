const {fromJS} = require('immutable');

let initialState = fromJS({
  privateKey: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.set('privateKey', fromJS(action.payload));
    default:
      return state;
  }
};

module.exports = user;
