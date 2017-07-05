const requestor = require('@edgeguideab/client-request');
const aes = window.require('../server/server_modules/crypt/authentication/aes.js');
const fs = window.require('fs');

const register = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let password = state.register.get('passwordInputValue');
    let reTypedPassword = state.register.get('reTypedPasswordInputValue');
    if (password !== reTypedPassword) {
      return dispatch ({
        type: 'REGISTER_PASSWORD_MISSMATCH',
        payload: 'Passwords didn\'t match. Try again.'
      });
    }

    dispatch({
      type: 'REGISTER_USER_START'
    });
    let privateKey = state.register.get('privateKey');
    let result;
    try {
      result = await aes.generatePaddedKey(password);
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'REGISTER_ORGAIZATION_FAIL',
        payload: 'Meep'
      });
    }

    let encryptedKey;
    try {
      encryptedKey = (await aes.encrypt(new window.Buffer(result.key, 'base64'), new window.Buffer(privateKey, 'base64')));
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'REGISTER_ORGANIZATION_FAIL',
        payload: 'Meep meep'
      });
    }

    fs.writeFileSync('./js/local_storage/encryptedPrivateKey', encryptedKey.toString('base64'));
    fs.writeFileSync('./js/local_storage/salt', result.salt.toString('base64'));
    let username = state.register.get('usernameInputValue');
    try {
      await requestor.post('http://localhost:8000/register/confirm', {
        body: {
          privateKey,
          username
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'REGISTER_ORGANIZATION_FAIL',
        payload: 'Meep meep'
      });
    }
    return dispatch ({
      type: 'REGISTER_ORGANIZATION_SUCCESS'
    });
  };
};

const registerTeamName = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let organization = state.register.get('organizationInputValue');
    let username = state.register.get('usernameInputValue');
    let email = state.register.get('emailInputValue');
    let response;
    dispatch({
      type: 'REGISTER_ORGANIZATION_NAME_START'
    });
    try {
      response = await requestor.post('http://localhost:8000/register', {
        body: {
          organization,
          username,
          email
        }
      });
    } catch (error) {
      return dispatch ({
        type: 'REGISTER_ORGANIZATION_NAME_ERROR',
        payload: 'Team name already exists.'
      });
    }
    return dispatch({
      type: 'REGISTER_ORGANIZATION_NAME_SUCCESS',
      payload: response.body.privateKey
    });
  };
};

module.exports = {register, registerTeamName};
