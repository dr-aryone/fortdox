const {fromJS} = require('immutable');

const initialState = fromJS({
  emailInputValue: '',
  isLoading: false,
  error: false,
  errorMsg: '',
  message: null
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
        errorMsg: fromJS(action.payload),
        isLoading: false
      });
    case 'INVITE_USER_SUCCESS':
      return state.merge({
        emailInputValue: '',
        isLoading: false,
        error: false,
        errorMsg: '',
        message: fromJS(action.payload)
      });
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = invite;
