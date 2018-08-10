const { fromJS } = require('immutable');

let initialState = fromJS({
  list: [],
  userList: [],
  isLoading: false,
  error: null,
  message: null
});

const permissions = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PERMISSIONS_LIST_START':
    case 'GET_USER_PERMISSIONS_LIST_START':
    case 'UPDATE_PERMISSION_START':
      return state.set('isLoading', true);
    case 'GET_PERMISSIONS_LIST_ERROR':
    case 'GET_USER_PERMISSIONS_LIST_ERROR':
    case 'UPDATE_PERMISSION_ERROR':
      return state.set('isLoading', false).set('error', fromJS(action.payload));
    case 'GET_PERMISSIONS_LIST_SUCCESS':
      return state.set('list', fromJS(action.payload)).set('isLoading', false);
    case 'GET_USER_PERMISSIONS_LIST_SUCCESS':
      return state
        .set('userList', fromJS(action.payload))
        .set('isLoading', false);
    case 'UPDATE_PERMISSION_SUCCESS':
      return state
        .set('isLoading', false)
        .set('error', null)
        .set('message', fromJS(action.payload));
    case 'HIDE_TOAST':
      return state.set('message', null);
    default:
      return state;
  }
};

module.exports = permissions;
