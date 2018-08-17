const requestor = require('@edgeguideab/client-request');
const config = require('config.json');
const permissions = config.permissions;

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
        case 500:
        default:
          return dispatch({
            type: 'GET_PERMISSIONS_LIST_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
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
        case 500:
        default:
          return dispatch({
            type: 'GET_USER_PERMISSIONS_LIST_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    dispatch({
      type: 'GET_USER_PERMISSIONS_LIST_SUCCESS',
      payload: response.body
    });
  };
}

export function updatePermission(email, userPermission, permission, toggle) {
  return async dispatch => {
    dispatch({
      type: 'UPDATE_PERMISSION_START'
    });

    if (userPermission & (1 === 1) && permissions[permission] !== 'ADMIN')
      return dispatch({
        type: 'UPDATE_PERMISSION_ERROR',
        payload: `Cannot remove ${
          permissions[permission]
        } permission from an admin. `
      });

    if (permissions[permission] === 'ADMIN') {
      try {
        if (toggle)
          await requestor.post(`${config.server}/permissions/admin`, {
            body: {
              email
            }
          });
        else
          await requestor.delete(`${config.server}/permissions/admin/${email}`);
      } catch (error) {
        console.error(error);
        switch (error.status) {
          case 400:
          case 403:
            return dispatch({
              type: 'UPDATE_PERMISSION_ERROR',
              payload: `Unable to update permission for ${email}.`
            });
          case 500:
          default:
            return dispatch({
              type: 'UPDATE_PERMISSION_ERROR',
              payload: 'Unable to connect to server. Please try again later.'
            });
        }
      }
    } else {
      try {
        await requestor.post(`${config.server}/permissions/users`, {
          body: {
            email,
            permission: toggle
              ? userPermission | permission
              : userPermission & ~permission
          }
        });
      } catch (error) {
        console.error(error);
        switch (error.status) {
          default:
            return dispatch({
              type: 'UPDATE_PERMISSION_ERROR',
              payload: `Unable to update permission for ${email}. Please try again later.`
            });
        }
      }
    }

    dispatch({
      type: 'UPDATE_PERMISSION_SUCCESS',
      payload: {
        text: 'Permissions has been successfully updated for ',
        user: email
      }
    });
  };
}
