const views = require('views.json');

const inputChange = (inputName, inputValue) => {
  return (dispatch, getState) => {
    let state = getState();
    switch (state.navigation.get('currentView')) {
      case views.REGISTER_VERIFY_VIEW:
      case views.REGISTER_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_REGISTER',
          inputName,
          inputValue
        });
      case views.LOGIN_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_LOGIN',
          inputName,
          inputValue
        });
      case views.SEARCH_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_SEARCH',
          inputName,
          inputValue
        });
      case views.CREATE_DOC_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_CREATE_DOC',
          inputName,
          inputValue
        });
      case views.UPDATE_DOC_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_UPDATE_DOC',
          inputName,
          inputValue
        });

      case views.INVITE_USER_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_INVITE_USER',
          inputName,
          inputValue
        });
      case views.VERIFY_USER_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_VERIFY_USER',
          inputName,
          inputValue
        });
    }
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

const currentViewToDefault = () => {
  return (dispatch, getState) => {
    let state = getState();
    let currentView = state.navigation.get('currentView');
    switch (currentView) {
      case views.CREATE_DOC_VIEW:
        return dispatch({
          type: 'CREATE_DOC_VIEW_TO_DEFAULT'
        });
      case views.UPDATE_DOC_VIEW:
        return dispatch({
          type: 'UPDATE_DOC_VIEW_TO_DEFAULT'
        });
      case views.SEARCH_VIEW:
        return dispatch({
          type: 'SEARCH_VIEW_TO_DEFAULT'
        });
      case views.LOGIN_VIEW:
        return dispatch({
          type: 'LOGIN_VIEW_TO_DEFAULT'
        });
      case views.REGISTER_VIEW:
      case views.REGISTER_VERIFY_VIEW:
        return dispatch({
          type: 'REGISTER_VIEW_TO_DEFAULT'
        });
    }
  };
};

const logout = () => {
  return dispatch => {
    return dispatch ({
      type: 'LOGOUT'
    });
  };
};

module.exports = {inputChange, changeView, currentViewToDefault, logout};
