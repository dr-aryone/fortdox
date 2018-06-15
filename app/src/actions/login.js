const requestor = require('@edgeguideab/client-request');
const electron = window.require('electron');
const aes = electron.remote.require('./aes.js');
const config = require('config.json');
const {
  addKey,
  readKey,
  readStorage,
  writeStorage
} = require('actions/utilities/storage');

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

export function login() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    const state = getState();
    const email = state.login.get('email');
    const password = state.login.get('password');
    const organization = state.login.get('organization');
    const storage = readStorage();
    const salt = storage[email][organization].salt;

    if (storage[email][organization].privateKey) {
      try {
        await addKey(
          storage[email][organization].privateKey,
          email,
          organization
        );
      } catch (error) {
        return dispatch({
          type: 'VERIFY_LOGIN_CREDS_ERROR',
          payload: 'Unable to migrate privateKey'
        });
      }
      writeStorage(salt, email, organization);
    }

    let encryptedPrivateKey;
    try {
      encryptedPrivateKey = await readKey(email, organization);
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: 'Unable to login.'
      });
    }
    let privateKey;
    try {
      let paddedPassword = (await aes.generatePaddedKey(
        password,
        new window.Buffer(salt, 'base64')
      )).key;
      privateKey = await aes.decrypt(
        new window.Buffer(paddedPassword, 'base64'),
        new window.Buffer(encryptedPrivateKey.split('"')[1], 'base64')
      );
      privateKey = Buffer.from(privateKey).toString('base64');
    } catch (error) {
      console.error(error);
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
        default:
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
}
