const requestor = require('@edgeguideab/client-request');
const aes = window.require('./aes.js');
const fs = window.require('fs');

const activateOrganizaton = () => {
  return async (dispatch, getState) => {
    let state = getState();
    dispatch({
      type: 'ACTIVATE_ORGANIZATION_START'
    });

    let privateKey = state.register.get('privateKey');
    let password = state.register.get('passwordInputValue');
    let reTypedPassword = state.register.get('reTypedPasswordInputValue');
    if (password !== reTypedPassword) {
      return dispatch ({
        type: 'REGISTER_PASSWORD_MISSMATCH',
        payload: 'Passwords didn\'t match. Try again.'
      });
    }
    let result;
    try {
      result = await aes.generatePaddedKey(password);
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Meep'
      });
    }
    let encryptedKey;
    try {
      encryptedKey = (await aes.encrypt(new window.Buffer(result.key, 'base64'), new window.Buffer(privateKey, 'base64')));
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Meep meep'
      });
    }
    fs.writeFileSync('./js/local_storage/encryptedPrivateKey', encryptedKey.toString('base64'));
    fs.writeFileSync('./js/local_storage/salt', result.salt.toString('base64'));
    let email;
    try {
      await requestor.post('http://localhost:8000/register/confirm', {
        body: {
          email
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'ACTIVATE_ORGANIZATION_FAIL',
        payload: 'Meep meep'
      });
    }
    return dispatch ({
      type: 'ACTIVATE_ORGANIZATION_SUCCESS'
    });
  };
};

const registerOrganization = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let organization = state.register.get('organizationInputValue');
    let username = state.register.get('usernameInputValue');
    let email = state.register.get('emailInputValue');
    dispatch({
      type: 'REGISTER_ORGANIZATION_NAME_START'
    });
    try {
      await requestor.post('http://localhost:8000/register', {
        body: {
          organization,
          username,
          email
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'REGISTER_ORGANIZATION_NAME_ERROR',
        payload: 'Team name already exists.'
      });
    }
    return dispatch({
      type: 'REGISTER_ORGANIZATION_NAME_SUCCESS'
    });
  };
};

const verifyActivationCode = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let activationCode = state.register.get('activationCode');
    let response;
    dispatch({
      type: 'VERIFY_ACTIVATION_CODE_START'
    });
    try {
      response = await requestor.post('http://localhost:8000/register/verify', {
        body: {
          activationCode
        }
      });
      return dispatch({
        type: 'VERIFY_ACTIVATION_CODE_SUCCESS',
        payload: window.Buffer.from(response.body.privateKey, 'base64').toString()
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'VERIFY_ACTIVATION_CODE_FAIL'
      });
    }

  };
};

module.exports = {activateOrganizaton, registerOrganization, verifyActivationCode};
