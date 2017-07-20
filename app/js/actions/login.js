const requestor = require('@edgeguideab/client-request');
const aes = window.require('./aes.js');
const config = require('../../config.json');
const {readStorage} = require('actions/utilities/storage');
const embedPrivateKey = require('actions/utilities/embedPrivateKey');

const loginAs = (email, organization) => {
  return dispatch => {
    dispatch({
      type: 'LOGIN_AS',
      payload: {
        email,
        organization
      }
    });
  };
};


const login = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });

    let state = getState();
    let email = state.login.get('email');
    let password = state.login.get('passwordInputValue');
    let organization = state.login.get('organization');
    let storage = readStorage();
    let encryptedPrivateKey = storage[email][organization].privateKey;
    let salt = storage[email][organization].salt;
    let privateKey;
    try {
      let paddedPassword = (await aes.generatePaddedKey(password, new window.Buffer(salt, 'base64'))).key;
      privateKey = (await aes.decrypt(new window.Buffer(paddedPassword, 'base64'), new window.Buffer(encryptedPrivateKey, 'base64')));
      privateKey = window.Buffer.from(privateKey).toString('base64');
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
          email
        },
        headers: embedPrivateKey(privateKey)
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
    return dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: {
        privateKey: privateKey.toString('base64'),
        email: email,
        organization: organization
      }
    });
  };
};

module.exports = {login, loginAs};
