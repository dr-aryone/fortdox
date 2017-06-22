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
      response = await requestor.post('http://localhost:8000/login', {
        body: {username: username, password: password}
      });
    } catch (error) {
      switch (error.status) {
        case 401:
        case 404:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: response.body.message,
            error: true
          });
        case 500:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_FAIL',
            payload: response.body.message,
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
    let response;
    try {
      // registerDone = await register(username, password);
      response = await requestor.post('http://localhost:8000/register', {
        body: {username: username, password: password}
      });
    } catch (error) {
      console.error(error);
      switch (response.body.status) {
        case 401:
        case 409:
          dispatch({
            type: 'REGISTER_USER_FAIL',
            payload: response.body.message,
            error: true
          });
          break;
        case 500:
          dispatch({
            type: 'REGISTER_USER_ERROR',
            payload: response.body.message,
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

function clearFields () {
  return dispatch => {
    dispatch({
      type: 'REGISTER_CLEAR_FIELDS'
    });
  };
}

module.exports = {login, inputChange, changeView, registerUser, clearFields, form};
