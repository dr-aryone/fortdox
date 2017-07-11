const {fromJS} = require('immutable');

const initialState = fromJS({
  emailInputValue: '',
  isLoading: false,
  error: false,
  errorMsg: ''
});

const invite = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_INVITE_USER':
      return state.set(action.inputName, fromJS(action.inputValue));
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
