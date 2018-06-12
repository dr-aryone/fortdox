const { fromJS } = require('immutable');

let initialState = fromJS({
  users: [],
  loading: false,
  error: ''
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_USERS_START': {
      return state.set('loading', true).set('error', '');
    }
    case 'LIST_USERS_ERROR': {
      return state.set('loading', false).set('error', action.payload);
    }
    case 'LIST_USERS_SUCCESS': {
      return state.set('loading', false).set('users', action.payload);
    }
    case 'LOGOUT': {
      return initialState;
    }
    default:
      return state;
  }
};

module.exports = user;
