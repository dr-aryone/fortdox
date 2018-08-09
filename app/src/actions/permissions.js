const requestor = require('@edgeguideab/client-request');
const config = require('config.json');

export default {
  getUserPermissions,
  getPermissionsList,
  getUserPermissionsList
};

export function getUserPermissions() {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_PERMISSIONS_START'
    });

    let response;
    try {
      response = await requestor.get(`${config.server}/permissions/me`);
    } catch (error) {
      console.error(error);
      switch (error.status) {
        default:
          dispatch({
            type: 'GET_USER_PERMISSIONS_ERROR'
          });
      }
    }

    dispatch({
      type: 'GET_USER_PERMISSIONS_SUCCESS',
      payload: response.body
    });
  };
}

export function getPermissionsList() {
  return async dispatch => {
    dispatch({
      type: 'GET_PERMISSIONS_LIST_START'
    });

    let response;
    try {
      response = await requestor.get(`${config.server}/permissions`);
    } catch (error) {
      console.error(error);
      switch (error.status) {
        default:
          dispatch({
            type: 'GET_PERMISSIONS_LIST_ERROR'
          });
      }
    }

    dispatch({
      type: 'GET_PERMISSIONS_LIST_SUCCESS',
      payload: response.body
    });
  };
}

export function getUserPermissionsList() {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_PERMISSIONS_LIST_START'
    });

    let response;
    try {
      response = await requestor.get(`${config.server}/permissions/users`);
    } catch (error) {
      console.error(error);
      switch (error.status) {
        default:
          dispatch({
            type: 'GET_USER_PERMISSIONS_LIST_ERROR'
          });
      }
    }

    dispatch({
      type: 'GET_USER_PERMISSIONS_LIST_SUCCESS',
      payload: response.body
    });
  };
}
