const requestor = require('@edgeguideab/requestor');
const views = require('views.json');

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
      response = await sendLogin(username, password);
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: error,
        error: true
      });
    }
    if (response.body.loggedIn) {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_SUCCESS',
        payload: {
          username: response.body.username
        }
      });
    } else {
      dispatch({
        type: 'VERIFY_LOGIN_CREDS_FAIL'
      });
    }
  };
};

const registerUser = () => {
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
    let registerDone;
    try {
      registerDone = await register(username, password);
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'REGISTER_USER_ERROR'
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
        type: 'REGISTER_USER_FAIL',
        payload: 'Username is already taken.',
        error: true
      });
    }
  };
};

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

const form = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let title = state.form.get('titleValue');
    let text = state.form.get('formValue');
    dispatch({
      type: 'SEND_FORM_START'
    });

    try {
      await requestor.post('http://localhost:8000/user/form', {
        body: {
          title: title,
          text: text
        }
      });
      dispatch({
        type: 'SEND_FORM_SUCCESS'
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'SEND_FORM_ERROR'
      });
    }
  };
};


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

module.exports = {login, inputChange, changeView, registerUser, clearFields, form};
