const {fromJS} = require('immutable');

const initialState = fromJS({
  username: '',
  password: '',
  reTypedPassword: '',
  error: false,
  errorMsg: ''
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_REGISTER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'REGISTER_USER_SUCCESS':
      return initialState;
    case 'REGISTER_WRONG_PASSWORD':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        'error': true,
        'errorMsg': fromJS(action.payload)
      });
    case 'REGISTER_USER_ERROR':
    case 'REGISTER_USER_FAIL':
      return state.merge({
        'username': '',
        'password': '',
        'reTypedPassword': '',
        'errorMsg': fromJS(action.payload),
        'error': true
      });
    default:
      return state;
  }
};

module.exports = register;
