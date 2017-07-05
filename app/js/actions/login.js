const requestor = require('@edgeguideab/client-request');
const aes = window.require('../server/server_modules/crypt/authentication/aes.js');
const fs = window.require('fs');

const login = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let email = state.login.get('emailInputValue');
    let password = state.login.get('passwordInputValue');
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    let encryptedPrivateKey;
    let salt;
    try {
      encryptedPrivateKey = fs.readFileSync('./js/local_storage/encryptedPrivateKey', 'utf-8');
      salt = fs.readFileSync('./js/local_storage/salt', 'utf-8');
    } catch (error) {
      return dispatch({
        payload: 'Wrong email or password. Try again.',
        error: true
      });
    }
    let privateKey;
    try {
      let paddedPassword = (await aes.generatePaddedKey(password, new window.Buffer(salt, 'base64'))).key;
      privateKey = (await aes.decrypt(new window.Buffer(paddedPassword, 'base64'), new window.Buffer(encryptedPrivateKey, 'base64')));
    } catch (error) {
      return dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: 'Wrong email or password. Try again.',
        error: true
      });
    }
    try {
      await requestor.post('http://localhost:8000/login', {
        body: {
          email,
          privateKey
        }
      });
    } catch (error) {
      switch (error.status) {
        case 401:
        case 404:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: error.errorText.message,
            error: true
          });
        case 500:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_FAIL',
            payload: error.errorText.message,
            error: true
          });
      }
    }
    return dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: privateKey.toString('base64')
    });
  };
};

module.exports = login;
