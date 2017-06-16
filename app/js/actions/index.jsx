const requestor = require('@edgeguideab/requestor');

const login = (username) => {
  return async dispatch => {
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    let isLoggedIn;
    try {
      isLoggedIn = await sendLogin(username);
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
        type: 'VERIFY_LOGIN_CREDS_DONE',
        payload: {
          user: isLoggedIn.body.message
        }
      });
    } else {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR'
      });
    }
  };
};

async function sendLogin(username) {
  try {
    let response = await requestor.post('http://localhost:8000/user', {
      body: {messege: username}
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

module.exports = login;
