const requestor = require('@edgeguideab/requestor');

const login = (username, password) => {
  return async dispatch => {
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    let isLoggedIn;
    try {
      isLoggedIn = await sendLogin(username, password);
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: error,
        error: true
      });
    }
    if (isLoggedIn.body.status) {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_SUCCESS',
        payload: {
          user: isLoggedIn.body.username
        }
      });
    } else {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_FAIL'
      });
    }
  };
};

const inputChange = (name, value) => {
  return dispatch => {
    dispatch({
      type: 'INPUT_CHANGE',
      name,
      value
    });
  };
};

async function sendLogin(username, password) {
  try {
    let response = await requestor.post('http://localhost:8000/user', {
      body: {username: username, password: password}
    });
    return response;
  } catch (error) {
    console.error(error);
    return {
      body: {
        status: false
      }
    };
  }
}

module.exports = {login, inputChange};
