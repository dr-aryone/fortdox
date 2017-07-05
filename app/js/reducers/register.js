const {fromJS} = require('immutable');

const initialState = fromJS({
  'organizationInputValue': '',
  'usernameInputValue': '',
  'emailInputValue': '',
  'passwordInputValue': '',
  'reTypedPasswordInputValue': '',
  'teamNameError': false,
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
      return state.set('privateKey', fromJS(action.payload));
    case 'REGISTER_PASSWORD_MISSMATCH':
      return state.merge({
        'password': '',
        'reTypedPassword': '',
        'verifyError': true,
        'errorMsg': fromJS(action.payload)
      });
    case 'REGISTER_VIEW_TO_DEFAULT':
      return initialState;
    case 'REGISTER_TEAM_ERROR':
    case 'REGISTER_TEAM_FAIL':
    default:
      return state;
  }
};

module.exports = register;
