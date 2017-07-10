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
    case 'REGISTER_PASSWORD_MISSMATCH':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        'verifyError': true,
        'errorMsg': fromJS(action.payload)
      });
    case 'ACTIVATE_ORGANIZATION_CODE_RECIVED':
      return initialState.set('activationCode', action.payload);
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'REGISTER_ORGANIZATION_NAME_SUCCESS':
    case 'REGISTER_VIEW_TO_DEFAULT':
      return initialState;
    case 'ACTIVATE_ORGANIZATION_FAIL':
    case 'ACTIVATE_ORGANIZATION_ERROR':
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
