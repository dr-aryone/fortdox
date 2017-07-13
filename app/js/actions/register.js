const requestor = require('@edgeguideab/client-request');
const encryptPrivateKey = require('actions/utilities/encryptPrivateKey');
const passwordCheck = require('actions/utilities/passwordCheck');
const config = require('../../config.json');

const activateOrganizaton = () => {
  return async (dispatch, getState) => {
    let state = getState();
    dispatch({
      type: 'ACTIVATE_ORGANIZATION_START'
    });

    let privateKey = state.register.get('privateKey');
    let password = state.register.get('passwordInputValue');
    let retypedPassword = state.register.get('retypedPasswordInputValue');
    let pwResult = passwordCheck(password, retypedPassword);
    if (!pwResult.valid) {
      console.error(pwResult.errorMsg);
      return dispatch ({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: pwResult.errorMsg
      });
    }
    try {
      await encryptPrivateKey(privateKey, password);
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Contact your administrator.'
      });
    }
    let email = state.register.get('email');
    try {
      await requestor.post(`${config.server}/register/confirm`, {
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
        type: 'ACTIVATE_ORGANIZATION_ERROR',
        payload: 'Meep meep'
      });
    }
    return dispatch ({
      type: 'ACTIVATE_ORGANIZATION_SUCCESS',
      payload: 'Team registration complete! You can now login.'
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
      await requestor.post(`${config.server}/register`, {
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
      type: 'REGISTER_ORGANIZATION_NAME_SUCCESS',
      payload: 'Please check your email to verify your registration.'
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
      response = await requestor.post(`${config.server}/register/verify`, {
        body: {
          activationCode
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'VERIFY_ACTIVATION_CODE_FAIL',
        payload: 'Email is already verified or the link is broken.'
      });
    }
    return dispatch({
      type: 'VERIFY_ACTIVATION_CODE_SUCCESS',
      payload: {
        email: response.body.email,
        privateKey: response.body.privateKey.toString('base64')
      }
    });
  };
};

module.exports = {activateOrganizaton, registerOrganization, verifyActivationCode};
