const views = require('views.json');

const inputChange = (inputName, inputValue) => {
  return (dispatch, getState) => {
    let state = getState();
    let type;
    switch (state.navigation.get('currentView')) {
      case views.REGISTER_VERIFY_VIEW:
      case views.REGISTER_VIEW:
        type = 'INPUT_CHANGE_REGISTER';
        break;
      case views.LOGIN_VIEW:
        type = 'INPUT_CHANGE_LOGIN';
        break;
      case views.SEARCH_VIEW:
        type = 'INPUT_CHANGE_SEARCH';
        break;
      case views.CREATE_DOC_VIEW:
        type = 'INPUT_CHANGE_CREATE_DOC';
        break;
      case views.UPDATE_DOC_VIEW:
        type = 'INPUT_CHANGE_UPDATE_DOC';
        break;
      case views.INVITE_USER_VIEW:
        type = 'INPUT_CHANGE_INVITE_USER';
        break;
      case views.VERIFY_USER_VIEW:
        type = 'INPUT_CHANGE_VERIFY_USER';
        break;
    }
    return dispatch({
      type,
      inputName,
      inputValue
    });
  };
};

const changeView = nextView => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_VIEW',
      payload: nextView
    });
  };
};

const logout = () => {
  return dispatch => {
    return dispatch ({
      type: 'LOGOUT'
    });
  };
};

module.exports = {inputChange, changeView, logout};
