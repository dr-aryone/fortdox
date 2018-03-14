const {fromJS} = require('immutable');

const initialState = fromJS({
  fields: {
    email: {
      value: '',
      error: null
    }
  },
  error: null,
  isLoading: false,
  message: null
});

const invite = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return initialState;
    case 'INPUT_CHANGE_INVITE_USER':
      return state.setIn(['fields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['fields', action.inputName, 'error'], null);
    case 'INVITE_USER_START':
      return state.set('isLoading', true);
    case 'INVITE_USER_FAIL':
      return state.merge({
        message: null,
        fields: state.get('fields').mergeDeepWith((oldError, newError) => newError ? newError : oldError, action.payload),
        isLoading: false,
        error: null
      });
    case 'INVITE_USER_ERROR':
      return state.merge({
        message: null,
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'INVITE_USER_SUCCESS':
      return initialState.set('message', fromJS(action.payload));
    case 'DELETE_USER_START':
      return state.set('isLoading', true);
    case 'DELETE_USER_ERROR':
      return state.merge({
        message: null,
        isLoading: false,
        error: fromJS(action.payload)
      });
    case 'DELETE_USER_SUCCESS':
      return initialState.set('message', fromJS(action.payload));
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = invite;
