const {fromJS} = require('immutable');

const initialState = fromJS({
  currentView: 'LOGIN_VIEW',
});

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.set('currentView', 'USER_VIEW');
    case 'CHANGE_VIEW_REGISTER':
      return state.set('currentView', 'REGISTER_VIEW');
    default:
      return state;
  }
};

module.exports = navigation;
