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
    case 'INPUT_CHANGE_INVITE_USER':
      return state.setIn(['fields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['fields', action.inputName, 'error'], null);
    case 'INVITE_USER_START':
      return state.set('isLoading', true);
    case 'INVITE_USER_FAIL':
      return state.merge({
        fields: state.get('fields').mergeDeepWith((oldError, newError) => newError ? newError : oldError, action.payload),
        isLoading: false,
        error: null
      });
    case 'INVITE_USER_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'INVITE_USER_SUCCESS':
      return state.merge({
        isLoading: false,
        error: null,
        message: fromJS(action.payload)
      }).setIn(['fields', 'email', 'value'], '');
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = invite;
