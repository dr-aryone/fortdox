const requestor = require('@edgeguideab/client-request');
const aes = window.require('../server/server_modules/crypt/authentication/aes.js');
const fs = window.require('fs');

const register = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let password = state.register.get('passwordInputValue');
    let reTypedPassword = state.register.get('reTypedPasswordValue');
    if (password !== reTypedPassword) {
      return dispatch ({
        type: 'REGISTER_PASSWORD_MISSMATCH',
        payload: 'Password didn\'t match.'
      });
    }

    dispatch({
      type: 'REGISTER_USER_START'
    });
    let privateKey = state.register.get('privateKey');
    let paddedKey;
    let salt;
    try {
      let result = await aes.generatePaddedKey(password, salt);
      paddedKey = result.key;
      salt = result.salt;
    } catch (error) {
      return dispatch ({
        type: 'REGISTER_ORGAIZATION_FAIL',
        payload: 'Meep meep'
      });
    }

    let encryptedKey;
    try {
      encryptedKey = (await aes.encrypt(new window.Buffer(password, 'base64'), new window.Buffer(paddedKey, 'base64'))).toString();
    } catch (error) {
      return dispatch ({
        type: 'REGISTER_ORGANIZATION_FAIL',
        payload: 'Meep meep'
      });
    }

    fs.writeFileSync('./js/local_storage/encryptedPrivateKey', encryptedKey.toString());
    fs.writeFileSync('./js/local_storage/salt', salt.toString());
    try {
      await requestor.post('http://localhost:8000/register', {
        body: {
          privateKey
        }
      });
    } catch (error) {
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
      type: 'REGISTER_TEAM_START'
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
        type: 'REGISTER_TEAM_ERROR',
        payload: error.Text.message
      });
    }
    return dispatch({
      type: 'REGISTER_TEAM_SUCCESS',
      payload: response.body.privateKey
    });
  };
};

module.exports = {register, registerTeamName};
