const requestor = require('@edgeguideab/client-request');
const config = require('config.json');

export default {
  list
};

export function list() {
  return async dispatch => {
    dispatch({
      type: 'LIST_USERS_START'
    });

    let response;
    try {
      response = await requestor.get(`${config.server}/users`);
    } catch (error) {
      console.error(error);
      let message = 'Server error';
      switch (error.status) {
        case 400:
        case 401:
          message = 'Bad request';
          break;
        case 404:
          message = 'You are not a part of an organization';
          break;
        default:
          console.error('Unknown status code');
          message = 'There was a problem and we are working on fixing it.';
          break;
      }
      dispatch({
        type: 'LIST_USERS_ERROR',
        payload: message
      });
      return;
    }
    return dispatch({
      type: 'LIST_USERS_SUCCESS',
      payload: response.body
    });
  };
}
