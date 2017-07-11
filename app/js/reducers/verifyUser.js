const {fromJS} = require('immutable');

const initialState = fromJS({
  usernameInputValue: '',
  passwordInputValue: '',
  retypedInputValue: '',
  error: false,
  errorMsg: '',
  isLoading: false,
  uuid: '',
  temporaryPassword: '',
  privateKey: ''
});

const verifyUser = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_VERIFY_USER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'ACTIVATE_USER_CODE_RECIVED':
      return state.merge({
        uuid: action.payload.code,
        temporaryPassword: action.payload.pass
      });
    case 'RECEIVE_PRIVATE_KEY_SUCCESS':
      return state.set('privateKey', action.payload);
    case 'VERIFY_NEW_USER_START':
      return state.set('isLoading', true);
    case 'VERIFY_NEW_USER_ERROR':
    case 'RECEIVE_PRIVATE_KEY_ERROR':
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
