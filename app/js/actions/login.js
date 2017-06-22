const requestor = require('@edgeguideab/requestor');

const login = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let username = state.login.get('userInputValue');
    let password = state.login.get('passwordInputValue');
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    let response;
    try {
      response = await requestor.post('http://localhost:8000/login', {
        body: {username: username, password: password}
      });
    } catch (error) {
      switch (error.status) {
        case 401:
        case 404:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: error.errorText.message,
            error: true
          });
        case 500:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_FAIL',
            payload: error.errorText.message,
            error: true
          });
      }
    }
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: {
        username: response.body.username
      }
    });
  };
};

module.exports = login;
