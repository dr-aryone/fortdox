const {fromJS} = require('immutable');

const initialState = fromJS({
  emailInputValue: '',
  passwordInputValue: '',
  retypedInputValue: '',
  error: false,
  errorMsg: '',
  isLoading: false,
  uuid: '',
  temporaryPassword: ''
});

const verifyUser = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_VERIFY_USER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_NEW_USER_START':
      return state.set('isLoading', true);
    case 'VERIFY_NEW_USER_ERROR':
      return state.merge({
        error: true,
        errorMsg: action.payload,
        isLoading: false
      });
    case 'VERIFY_NEW_USER_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = verifyUser;
