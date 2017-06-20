const {fromJS} = require('immutable');

const initialState = fromJS({
  username: '',
  password: '',
  reTypedPassword: '',
  error: false
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_REGISTER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'REGISTER_USER_SUCCESS':
      return initialState;
    case 'REGISTER_CLEAR_FIELDS':
      return state.merge({
        'password': '',
        'reTypedPassword': ''
      });
    case 'REGISTER_USER_FAIL':
      return state.merge({
        'username': '',
        'password': '',
        'reTypedPassword': '',
        'error': true
      });
    default:
      return state;
  }
};

module.exports = register;
