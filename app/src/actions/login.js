import {
  addKey,
  readKey,
  readStorage,
  writeStorage,
  writeDeviceIdToStorage
} from 'actions/utilities/storage';
const requestor = require('@edgeguideab/client-request');
const electron = window.require('electron');
const aes = electron.remote.require('./aes.js');
const config = require('config.json');

export default { login, loginAs, directLogin };

export function directLogin() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DIRECT_LOGIN_START'
    });

    //Migrating privatekey from storage to keychain
    const oldStorage = JSON.parse(window.localStorage.getItem('fortdox'));
    if (oldStorage) {
      for (let email in oldStorage) {
        for (let organization in oldStorage[email]) {
          const privateKey = oldStorage[email][organization].privateKey;
          const salt = oldStorage[email][organization].salt;
          try {
            await addKey(privateKey, email, organization);
          } catch (error) {
            return dispatch({
              type: 'VERIFY_LOGIN_CREDS_ERROR',
              payload: 'Unable to migrate privateKey'
            });
          }
          writeStorage(salt, organization, email);
        }
      }

      window.localStorage.removeItem('fortdox');
      return dispatch({
        type: 'PRIVATE_KEY_MIGRATION_DONE',
        payload: 'Migration of old data has been completed.'
      });
    }

    let state = getState();
    if (state.verifyUser.get('forceBack'))
      return dispatch({
        type: 'FORCE_BACK'
      });

    if (localStorage.getItem('activeUser')) {
      let email;
      let organization;
      let response;
      try {
        response = await requestor.get(`${config.server}/login/check`);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('activeUser');
        return dispatch({
          type: 'DIRECT_LOGIN_FAILED'
        });
      }

      email = response.body.email;
      organization = response.body.organization;
      try {
        response = await requestor.get(`${config.server}/permissions/me`);
      } catch (error) {
        console.error(error);
        return dispatch({
          type: 'DIRECT_LOGIN_FAILED'
        });
      }
      const permission = response.body.permission;
      const superUser = response.body.owner ? true : false;

      try {
        response = await requestor.get(`${config.server}/permissions`);
      } catch (error) {
        console.error(error);
        return dispatch({
          type: 'DIRECT_LOGIN_FAILED'
        });
      }

      const permissions = {};
      const permissionsList = response.body;
      for (let p in permissionsList) {
        const key = permissionsList[p].replace(' ', '_');
        permissions[key] = (permission & parseInt(p, 10)) === parseInt(p, 10);
      }

      return dispatch({
        type: 'DIRECT_LOGIN_SUCCESS',
        payload: {
          email,
          organization,
          permission,
          superUser,
          permissions
        }
      });
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

    let deviceId = storage[email][organization].deviceId;
    let response;
    try {
      response = await requestor.post(`${config.server}/login`, {
        body: {
          email,
          privateKey,
          deviceId: deviceId === undefined ? undefined : deviceId
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

    // Migrating non-existing deviceId
    const serverGaveUsdeviceId = response.body.deviceId !== undefined;
    if (serverGaveUsdeviceId) {
      deviceId = response.body.deviceId;
      writeDeviceIdToStorage(deviceId, organization, email);
    }

    try {
      response = await requestor.get(`${config.server}/permissions/me`);
    } catch (error) {
      switch (error.status) {
        default:
          return dispatch({
            type: 'VERIFY_LOGIN_CREDS_ERROR',
            payload: 'Unable to login. Please try again later.'
          });
      }
    }

    const permission = response.body.permission;
    const superUser = response.body.owner ? true : false;
    try {
      response = await requestor.get(`${config.server}/permissions`);
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'DIRECT_LOGIN_FAILED'
      });
    }

    const permissions = {};
    const permissionsList = response.body;
    for (let p in permissionsList) {
      const key = permissionsList[p].replace(' ', '_');
      permissions[key] = (permission & parseInt(p, 10)) === parseInt(p, 10);
    }

    return dispatch({
      type: 'VERIFY_LOGIN_CREDS_SUCCESS',
      payload: {
        email: email,
        organization: organization,
        permissions,
        permission,
        superUser
      }
    });
  };
}
