const requestor = require('@edgeguideab/client-request');
const passwordCheck = require('actions/utilities/passwordCheck');
const encryptPrivateKey = require('actions/utilities/encryptPrivateKey');
const config = require('../../config.json');
const storeData = require('actions/utilities/storeData');

const inviteUser = () => {
  return async (dispatch, getState) => {
    dispatch ({
      type: 'INVITE_USER_START'
    });

    let state = getState();
    let newUserEmail = state.invite.get('emailInputValue');
    let privateKey = state.user.get('privateKey');
    let email = state.user.get('email');
    try {
      await requestor.post(`${config.server}/invite`, {
        body: {
          email,
          newUserEmail
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'INVITE_USER_ERROR',
        payload: 'Cannot connect to server.'
      });
    }

    dispatch ({
      type: 'INVITE_USER_SUCCESS',
      payload: 'Invitation has been sent to the user!'
    });
  };
};

const receivePrivateKey = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let uuid = state.verifyUser.get('uuid');
    let temporaryPassword = state.verifyUser.get('temporaryPassword');
    dispatch ({
      type: 'RECEIVE_PRIVATE_KEY_START'
    });

    let response;
    try {
      response = await requestor.post(`${config.server}/invite/verify`, {
        body: {
          temporaryPassword,
          uuid
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'RECEIVE_PRIVATE_KEY_ERROR',
        payload: 'Email is already verified or the link is broken.'
      });
    }
    dispatch ({
      type: 'RECEIVE_PRIVATE_KEY_SUCCESS',
      payload: response.body.privateKey
    });
  };
};

const verifyUser = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'VERIFY_NEW_USER_START'
    });

    let state = getState();
    let username = state.verifyUser.get('usernameInputValue');
    let password = state.verifyUser.get('passwordInputValue');
    let retypedPassword = state.verifyUser.get('retypedInputValue');
    let privateKey = state.verifyUser.get('privateKey');
    let uuid = state.verifyUser.get('uuid');
    let pwResult = passwordCheck(password, retypedPassword);
    if (!pwResult.valid) {
      return dispatch ({
        type: 'VERIFY_NEW_USER_ERROR',
        payload: pwResult.errorMsg
      });
    }

    let result;
    try {
      result = await encryptPrivateKey(privateKey, password);
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'VERIFY_NEW_USER_ERROR',
        payload: 'Link is broken.'
      });
    }

    let response;
    try {
      response = await requestor.post(`${config.server}/invite/confirm`, {
        body: {
          uuid,
          username
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'VERIFY_NEW_USER_ERROR',
        payload: 'Internal server error.'
      });
    }

    let salt = result.salt;
    let organization = response.body.organization;
    let email = response.body.email;
    let encryptedPrivateKey = result.privateKey;
    storeData(username, encryptedPrivateKey, salt, organization, email);
    dispatch ({
      type: 'VERIFY_NEW_USER_SUCCESS',
      payload: {
        username,
        privateKey,
        organization,
        email
      }
    });
  };
};

module.exports = {inviteUser, receivePrivateKey, verifyUser};
