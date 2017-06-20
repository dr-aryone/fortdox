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
          username: isLoggedIn.body.username
        }
      });
    } else {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_FAIL'
      });
    }
  };
};

const registerUser = (username, password) => {
  return async dispatch => {
    dispatch({
      type: 'REGISTER_USER_START'
    });
    let registerDone;
    try {
      registerDone = await register(username, password);
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'REGISTER_USER_ERROR',
        payload: error,
        error: true
      });
    }
    if (registerDone.body.status) {
      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: {
          username: registerDone.body.username
        }
      });
    } else {
      dispatch({
        type: 'REGISTER_USER_FAIL'
      });
    }
  };
};

const inputChange = (view, inputName, inputValue) => {
  switch (view) {
    case 'register_view':
      return dispatch => {
        dispatch({
          type: 'INPUT_CHANGE_REGISTER',
          inputName,
          inputValue
        });
      };
    case 'login_view':
      return dispatch => {
        dispatch({
          type: 'INPUT_CHANGE_LOGIN',
          inputName,
          inputValue
        });
      };
  }

};

const changeView = view => {
  switch (view) {
    case 'register':
      return dispatch => {
        dispatch({
          type: 'CHANGE_VIEW_REGISTER'
        });
      };
  }
};

async function sendLogin(username, password) {
  try {
    let response = await requestor.post('http://localhost:8000/login', {
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

async function register(username, password) {
  try {
    let response = await requestor.post('http://localhost:8000/register', {
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

function clearFields () {
  return dispatch => {
    dispatch({
      type: 'REGISTER_CLEAR_FIELDS'
    });
  };
}

module.exports = {login, inputChange, changeView, registerUser, clearFields};
