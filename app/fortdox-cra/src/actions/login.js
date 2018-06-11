const requestor = require('@edgeguideab/client-request');
const electron = window.require('electron');
const aes = electron.remote.require('./aes.js');
const config = require('config.json');
const { readStorage } = require('actions/utilities/storage');
export default { login, loginAs, directLogin };

export function directLogin() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DIRECT_LOGIN_START'
    });

    let state = getState();
    if (state.verifyUser.get('forceBack'))
      return dispatch({
        type: 'FORCE_BACK'
      });

    if (localStorage.getItem('activeUser')) {
      try {
        let response = await requestor.get(`${config.server}/login/check`);
        return dispatch({
          type: 'DIRECT_LOGIN_SUCCESS',
          payload: {
            email: response.body.email,
            organization: response.body.organization
          }
        });
      } catch (error) {
        localStorage.removeItem('activeUser');
        return dispatch({
          type: 'DIRECT_LOGIN_FAILED'
        });
      }
    } else {
      setTimeout(() => {
        return dispatch({
          type: 'DIRECT_LOGIN_FAILED'
        });
      }, 200);
    }
  };
}

export function loginAs(email, organization) {
  return {
    type: 'LOGIN_AS',
    payload: {
      email,
      organization
    }
  };
}

export const login = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    let state = getState();
    let email = state.login.get('email');
    let password = state.login.get('password');
    let organization = state.login.get('organization');
    let storage = readStorage();
    let encryptedPrivateKey = storage[email][organization].privateKey;
    let salt = storage[email][organization].salt;
    let privateKey;
    try {
      let paddedPassword = (await aes.generatePaddedKey(
        password,
        new window.Buffer(salt, 'base64')
      )).key;
      privateKey = await aes.decrypt(
        new window.Buffer(paddedPassword, 'base64'),
        new window.Buffer(encryptedPrivateKey, 'base64')
      );
      privateKey = Buffer.from(privateKey).toString('base64');
    } catch (error) {
      return dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: 'Wrong password. Please try again.',
        error: true
      });
    }
    let response;
    try {
      response = await requestor.post(`${config.server}/login`, {
        body: {
          email,
          privateKey
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 401:
        case 404:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: 'Wrong password. Please try again.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    localStorage.setItem('activeUser', response.body.token);
    return dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: {
        email: email,
        organization: organization
      }
    });
  };
};
