const { fromJS } = require('immutable');

const initialState = fromJS({
  fields: {
    email: {
      value: '',
      error: null
    }
  },
  users: [],
  error: null,
  isLoading: false,
  message: null,
  refresh: false
});

const invite = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return initialState;
    case 'INPUT_CHANGE_INVITE_USER':
      return state
        .setIn(['fields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['fields', action.inputName, 'error'], null);
    case 'INVITE_USER_START':
      return state.set('isLoading', true);
    case 'INVITE_USER_FAIL':
      return state.merge({
        message: null,
        fields: state
          .get('fields')
          .mergeDeepWith(
            (oldError, newError) => (newError ? newError : oldError),
            action.payload
          ),
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
    case 'LIST_USERS_START':
      return state.set('isLoading', true).set('error', '');
    case 'LIST_USERS_ERROR':
      return state.set('isLoading', false).set('error', action.payload);
    case 'LIST_USERS_SUCCESS':
      return state
        .set('isLoading', false)
        .set('refresh', false)
        .set('users', action.payload);
    case 'CHANGE_VIEW':
      if (action.payload === 'INVITE_USER_VIEW') {
        return state.set('refresh', true);
      } else {
        return state;
      }
    default:
      return state;
  }
};

module.exports = invite;
