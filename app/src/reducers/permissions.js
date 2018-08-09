const { fromJS } = require('immutable');

let initialState = fromJS({
  list: [],
  userList: [],
  isLoading: false,
  error: null
});

const permissions = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PERMISSIONS_LIST_START':
    case 'GET_USER_PERMISSIONS_LIST_START':
      return state.set('isLoading', true);
    case 'GET_PERMISSIONS_LIST_ERROR':
    case 'GET_USER_PERMISSIONS_LIST_ERROR':
      return state.set('isLoading', false).set('error', fromJS(action.payload));
    case 'GET_PERMISSIONS_LIST_SUCCESS':
      return state
        .set('list', fromJS(action.payload))
        .set('isLoading', false)
        .set('error', null);
    case 'GET_USER_PERMISSIONS_LIST_SUCCESS':
      return state
        .set('userList', fromJS(action.payload))
        .set('isLoading', false)
        .set('error', null);
    default:
      return state;
  }
};

module.exports = permissions;
