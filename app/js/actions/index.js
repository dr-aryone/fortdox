const inputChange = (inputName, inputValue) => {
  return (dispatch, getState) => {
    let state = getState();
    let type;
    switch (state.navigation.get('currentView')) {
      case 'ACTIVATE_ORGANIZATION_VIEW':
        type ='INPUT_CHANGE_ACTIVATE_ORGANIZATION';
        break;
      case 'REGISTER_VIEW':
        type = 'INPUT_CHANGE_REGISTER_ORGANIZATION';
        break;
      case 'VERIFY_LOGIN_VIEW':
        type = 'INPUT_CHANGE_VERIFY_LOGIN';
        break;
      case 'CREATE_DOC_VIEW':
        type = 'INPUT_CHANGE_CREATE_DOC';
        break;
      case 'UPDATE_DOC_VIEW':
        type = 'INPUT_CHANGE_UPDATE_DOC';
        break;
      case 'SEARCH_VIEW':
      case 'USER_VIEW':
        type = 'INPUT_CHANGE_SEARCH';
        break;
      case 'INVITE_USER_VIEW':
        type = 'INPUT_CHANGE_INVITE_USER';
        break;
      case 'VERIFY_USER_VIEW':
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

const forceBack = () => {
  return dispatch => {
    dispatch({
      type: 'FORCE_BACK'
    });
  };
};

const logout = () => {
  return dispatch => {
    return dispatch({
      type: 'LOGOUT'
    });
  };
};

module.exports = {inputChange, changeView, logout, forceBack};
