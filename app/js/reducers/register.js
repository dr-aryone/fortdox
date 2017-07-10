const {fromJS} = require('immutable');

const initialState = fromJS({
  'organizationInputValue': '',
  'usernameInputValue': '',
  'emailInputValue': '',
  'passwordInputValue': '',
  'reTypedPasswordInputValue': '',
  'orgNameError': false,
  'activateError': false,
  'errorMsg': '',
  'privateKey': '',
  'isLoading': false,
  'isVerified': false
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_REGISTER':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'VERIFY_ACTIVATION_CODE_START':
    case 'REGISTER_ORGANIZATION_NAME_START':
      return state.set('isLoading', true);
    case 'REGISTER_PASSWORD_MISSMATCH':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        'activateError': true,
        'errorMsg': fromJS(action.payload)
      });
    case 'ACTIVATE_ORGANIZATION_CODE_RECIVED':
      return initialState.set('activationCode', fromJS(action.payload));
    case 'VERIFY_ACTIVATION_CODE_SUCCESS':
      return state.merge({
        'email': fromJS(action.payload.email),
        'privateKey': fromJS(action.payload.privateKey),
        'isLoading': false,
        'isVerified': true
      });
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
    case 'REGISTER_ORGANIZATION_NAME_SUCCESS':
    case 'REGISTER_VIEW_TO_DEFAULT':
      return initialState;
    case 'ACTIVATE_ORGANIZATION_ERROR':
    case 'VERIFY_ACTIVATION_CODE_FAIL':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        activateError: true,
        errorMsg: fromJS(action.payload),
        isLoading: false
      });
    case 'REGISTER_ORGANIZATION_NAME_ERROR':
      return state.merge({
        'orgNameError': true,
        'errorMsg': fromJS(action.payload),
        isLoading: false
      });
    default:
      return state;
  }
};

module.exports = register;
