const views = require('views.json');

const inputChange = (inputName, inputValue) => {
  return (dispatch, getState) => {
    let state = getState();
    switch (state.navigation.get('currentView')) {
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
      case views.FORM_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_FORM',
          inputName,
          inputValue
        });
      case views.SEARCH_VIEW:
        return dispatch({
          type: 'INPUT_CHANGE_SEARCH',
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

function clearFields () {
  return dispatch => {
    dispatch({
      type: 'REGISTER_CLEAR_FIELDS'
    });
  };
}


module.exports = {inputChange, changeView, clearFields};
