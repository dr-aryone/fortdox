const { fromJS } = require('immutable');

const initialState = fromJS({
  registerFields: {
    organization: {
      value: '',
      error: null
    },
    email: {
      value: '',
      error: null
    }
  },
  activateFields: {
    password: {
      value: '',
      error: null
    },
    retypedPassword: {
      value: '',
      error: null
    }
  },
  verifyCodeError: null,
  activationCode: {
    value: '',
    error: null
  },
  isVerified: false,
  privateKey: '',
  isLoading: false,
  registerError: null,
  activateOrgError: null,
  message: null
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return initialState;
    case 'INPUT_CHANGE_REGISTER_ORGANIZATION':
      return state
        .setIn(
          ['registerFields', action.inputName, 'value'],
          fromJS(action.inputValue)
        )
        .setIn(['registerFields', action.inputName, 'error'], null);
    case 'INPUT_CHANGE_ACTIVATE_ORGANIZATION':
      return state
        .setIn(
          ['activateFields', action.inputName, 'value'],
          fromJS(action.inputValue)
        )
        .setIn(['activateFields', action.inputName, 'error'], null);
    case 'INPUT_CHANGE_VERIFY_ORGANIZATION':
      return state.setIn(
        ['activationCode', 'value'],
        fromJS(action.inputValue)
      ).setIn(['activationCode', 'error'], null);
    case 'REGISTER_ORGANIZATION_START':
    case 'VERIFY_ACTIVATION_CODE_START':
    case 'ACTIVATE_ORGANIZATION_START':
      return state.set('isLoading', true);
    case 'ACTIVATE_ORGANIZATION_CODE_RECIVED':
      return state.setIn(['activationCode', 'value'], fromJS(action.payload));
    case 'VERIFY_ACTIVATION_CODE_SUCCESS':
      return state
        .merge({
          privateKey: fromJS(action.payload.privateKey),
          isLoading: false,
          isVerified: true
        })
        .setIn(
          ['registerFields', 'email', 'value'],
          fromJS(action.payload.email)
        );
    case 'VERIFY_ACTIVATION_CODE_FAIL':
      return state
        .setIn(['activationCode', 'error'], action.payload)
        .set('isLoading', false);
    case 'REGISTER_ORGANIZATION_SUCCESS':
      return initialState.set('message', fromJS(action.payload));
    case 'CHANGE_VIEW':
    case 'ACTIVATE_ORGANIZATION_SUCCESS':
      return initialState;
    case 'VERIFY_ACTIVATION_CODE_ERROR':
      return state.merge({
        verifyCodeError: fromJS(action.payload),
        isLoading: false,
        message: null
      });
    case 'ACTIVATE_ORGANIZATION_PASSWORD_FAIL':
      return state
        .set('isLoading', false)
        .setIn(['activateFields', 'password', 'error'], fromJS(action.payload));
    case 'ACTIVATE_ORGANIZATION_PASSWORD_MISSMATCH_FAIL':
      return state
        .set('isLoading', false)
        .setIn(
          ['activateFields', 'retypedPassword', 'error'],
          fromJS(action.payload)
        );
    case 'REGISTER_ORGANIZATION_FAIL':
      return state.merge({
        registerFields: state
          .get('registerFields')
          .mergeDeepWith(
            (oldError, newError) => (newError ? newError : oldError),
            action.payload
          ),
        isLoading: false
      });
    case 'ACTIVATE_ORGANIZATION_FAIL':
      return state.merge({
        activateFields: state
          .get('activateFields')
          .mergeDeepWith(
            (oldError, newError) => (newError ? newError : oldError),
            action.payload
          ),
        isLoading: false
      });
    case 'REGISTER_ORGANIZATION_NAME_FAIL':
      return state
        .setIn(
          ['registerFields', 'organization', 'error'],
          fromJS(action.payload)
        )
        .set('isLoading', false);
    case 'REGISTER_ORGANIZATION_EMAIL_FAIL':
      return state
        .setIn(['registerFields', 'email', 'error'], fromJS(action.payload))
        .set('isLoading', false);
    case 'REGISTER_ORGANIZATION_ERROR':
      return state.merge({
        registerError: fromJS(action.payload),
        isLoading: false
      });
    case 'ACTIVATE_ORGANIZATION_ERROR':
      return state.merge({
        activateOrgError: fromJS(action.payload),
        isLoading: false,
        message: null
      });
    default:
      return state;
  }
};

module.exports = register;
