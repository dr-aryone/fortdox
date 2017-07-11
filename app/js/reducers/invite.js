const {fromJS} = require('immutable');

const initialState = fromJS({
  email: '',
  isLoading: false,
  error: false,
  errorMsg: ''
});

const invite = (state = initialState, action) => {
  switch (action.type) {
    case 'INVITE_USER_START':
      return state.set('isLoading', true);
    case 'INVITE_USER_ERROR':
      return state.merge({
        error: true,
        errorMsg: action.payload,
        isLoading: false
      });
    case 'INVITE_USER_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = invite;
