const {fromJS} = require('immutable');

const initialState = fromJS({
  'organizationInputValue': '',
  'usernameInputValue': '',
  'emailInputValue': '',
  'passwordInputValue': '',
  'reTypedPasswordInputValue': '',
  'orgNameError': false,
  'verifyError': false,
  'errorMsg': '',
  'privateKey': ''
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_REGISTER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'REGISTER_ORGANIZATION_SUCCESS':
      return initialState;
    case 'REGISTER_ORGANIZATION_NAME_SUCCESS':
      return state.merge({
        'orgNameError': false,
        'errorMsg': false,
        'privateKey': fromJS(action.payload)
      });
    case 'REGISTER_PASSWORD_MISSMATCH':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        'verifyError': true,
        'errorMsg': fromJS(action.payload)
      });
    case 'REGISTER_VIEW_TO_DEFAULT':
      return initialState;
    case 'REGISTER_ORGANIZATION_FAIL':
    case 'REGISTER_ORGANIZATION_ERROR':
    case 'REGISTER_ORGANIZATION_NAME_ERROR':
    case 'REGISTER_ORGANIZATION_NAME_FAIL':
      return state.merge({
        'orgNameError': true,
        'errorMsg': fromJS(action.payload)
      });
    default:
      return state;
  }
};

module.exports = register;
