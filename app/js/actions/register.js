const requestor = require('@edgeguideab/client-request');

const register = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let username = state.register.get('username');
    let password = state.register.get('password');
    let reTypedPassword = state.register.get('reTypedPassword');

    if (password !== reTypedPassword) {
      return dispatch({
        type: 'REGISTER_WRONG_PASSWORD',
        payload: 'Password didn\'t match.'
      });
    }
    dispatch({
      type: 'REGISTER_USER_START'
    });
    let response;
    try {
      response = await requestor.post('http://localhost:8000/register', {
        body: {username: username, password: password}
      });
    } catch (error) {
      switch (error.status) {
        case 401:
        case 409:
          return dispatch({
            type: 'REGISTER_USER_FAIL',
            payload: error.errorText.message,
            error: true
          });
        case 500:
          return dispatch({
            type: 'REGISTER_USER_ERROR',
            payload: error.errorText.message,
            error: true
          });
      }
    }
    dispatch({
      type: 'REGISTER_USER_SUCCESS',
      payload: {
        username: response.body.username
      }
    });
  };
};

const registerTeamName = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let organization = state.register.get('organizationInputValue');
    let username = state.register.get('usernameInputValue');
    dispatch({
      type: 'REGISTER_TEAM_START'
    });
    let response;
    try {
      response = await requestor.post('http://localhost:8000/register', {
        body: {
          organization,
          username
        }
      });
    } catch (error) {
      return dispatch ({
        type: 'REGISTER_TEAM_ERROR'
      });
    }
    return dispatch({
      type: 'REGISTER_TEAM_SUCCESS'
    });


  };
};

module.exports = {register, registerTeamName};
