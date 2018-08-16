const { fromJS } = require('immutable');

let initialState = fromJS({
  email: '',
  organization: '',
  permission: 0,
  superUser: false,
  permissions: null
});

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'DIRECT_LOGIN_SUCCESS':
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.merge({
        email: fromJS(action.payload.email),
        organization: fromJS(action.payload.organization)
      });
    case 'GET_PERMISSIONS_SUCCESS':
      return state.merge({
        permission: fromJS(action.payload.permission),
        permissions: fromJS(action.payload.permissions),
        superUser: fromJS(action.payload.superUser)
      });
    case 'LOGOUT':
      localStorage.removeItem(state.get('email'));
      return initialState;
    default:
      return state;
  }
};

module.exports = user;
