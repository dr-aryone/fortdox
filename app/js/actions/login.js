const requestor = require('@edgeguideab/client-request');
const aes = window.require('../server/authentication/aes.js');
const fs = window.require('fs');
let encryptedPrivateKey = fs.readFileSync('./js/encryptedPrivateKey', 'utf-8');
let salt = fs.readFileSync('./js/salt', 'utf-8');
//let privateKey = fs.readFileSync('./js/private_key.pem');
const login = () => {
  return async (dispatch, getState) => {
    let state = getState();
    //let username = state.login.get('userInputValue');
    let password = state.login.get('passwordInputValue');
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_START'
    });
    // let encryptedPrivateKey;
    // try {
    //   let key = await aes.generatePaddedKey(password, salt);
    //   fs.writeFileSync('./js/paddedKey', key.key.toString('base64'));
    //   encryptedPrivateKey = await aes.encrypt(new window.Buffer(key.key, 'base64'), new window.Buffer(privateKey, 'base64'));
    //   encryptedPrivateKey = encryptedPrivateKey.toString('base64');
    //   fs.writeFileSync('./js/encryptedPrivateKey', encryptedPrivateKey);
    // } catch (error) {
    //   console.error(error);
    // }
    let privateKey;
    try {
      let key = (await aes.generatePaddedKey(password, salt)).key;
      privateKey = (await aes.decrypt(new window.Buffer(key, 'base64'), new window.Buffer(encryptedPrivateKey, 'base64'))).toString();
    } catch (error) {
      return dispatch({
        type: 'VERIFY_LOGIN_CREDS_ERROR',
        payload: 'Wrong password!',
        error: true
      });
    }
    let response;
    try {
      response = await requestor.post('http://localhost:8000/login', {
        body: {
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
    dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: {
        username: 'testuser'
      }
    });
  };
};

module.exports = login;
