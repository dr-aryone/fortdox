const {fromJS} = require('immutable');
const views = require('views.json');

const initialState = fromJS({
  currentView: views.LOGIN_VIEW,
});

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return state.set('currentView', fromJS(views.USER_VIEW));
    case 'CHANGE_VIEW':
      return state.set('currentView', fromJS(action.payload));
    case 'REGISTER_USER_SUCCESS':
      return state.set('currentView', fromJS(views.LOGIN_VIEW));
    default:
      return state;
  }
};

module.exports = navigation;
