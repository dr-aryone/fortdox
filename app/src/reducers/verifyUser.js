const { fromJS } = require('immutable');
const initialState = fromJS({
  fields: {
    password: {
      value: '',
      error: null
    },
    retypedPassword: {
      value: '',
      error: null
    },
    uuid: {
      value: '',
      error: null
    },
    temporaryPassword: {
      value: '',
      error: null
    }
  },
  error: null,
  isLoading: false,
  privateKey: null,
  deviceId: null,
  forceBack: false
});

const verifyUser = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_INVITE_VIEW':
    case 'INPUT_CHANGE_VERIFY_USER':
      return state
        .setIn(['fields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['fields', action.inputName, 'error'], null);
    case 'ACTIVATE_USER_CODE_RECIVED':
      return state
        .setIn(['fields', 'uuid', 'value'], action.payload.code)
        .setIn(['fields', 'temporaryPassword', 'value'], action.payload.pass);
    case 'RECEIVE_PRIVATE_KEY_SUCCESS':
      return state.merge({
        privateKey: fromJS(action.payload.privateKey),
        deviceId: fromJS(action.payload.devideId),
        isLoading: false
      });
    case 'RECEIVE_PRIVATE_KEY_FAIL':
      return state.merge({
        fields: state
          .get('fields')
          .mergeDeepWith(
            (oldError, newError) => (newError ? newError : oldError),
            action.payload
          ),
        isLoading: false
      });
    case 'VERIFY_NEW_USER_START':
      return state.set('isLoading', true);
    case 'VERIFY_NEW_USER_FAIL':
      return state.merge({
        fields: state
          .get('fields')
          .mergeDeepWith(
            (oldError, newError) => (newError ? newError : oldError),
            action.payload
          ),
        isLoading: false
      });
    case 'VERIFY_NEW_USER_PASSWORD_FAIL':
      return state
        .set('isLoading', false)
        .setIn(['fields', 'password', 'error'], fromJS(action.payload));
    case 'VERIFY_NEW_USER_PASSWORD_MISSMATCH_FAIL':
      return state
        .set('isLoading', false)
        .setIn(['fields', 'retypedPassword', 'error'], fromJS(action.payload));
    case 'VERIFY_NEW_USER_ERROR':
    case 'RECEIVE_PRIVATE_KEY_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'FORCE_BACK':
      return state.set('forceBack', true);
    case 'CHANGE_VIEW':
    case 'VERIFY_NEW_USER_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = verifyUser;
