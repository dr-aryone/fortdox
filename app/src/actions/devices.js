import requestor from '@edgeguideab/client-request';
import config from 'config.json';
import QRCode from 'qrcode';
import { readStorage } from 'actions/utilities/storage';

export const getDevices = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'GET_DEVICES_START'
    });
    const state = getState();
    const email = state.user.get('email');
    const organization = state.user.get('organization');
    const storage = readStorage();
    const deviceId = storage[email][organization].deviceId;

    let response;
    try {
      response = await requestor.get(`${config.server}/devices`);
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
          return dispatch({
            type: 'GET_DEVICES_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
        default:
          return dispatch({
            type: 'GET_DEVICES_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    dispatch({
      type: 'GET_DEVICES_SUCCESS',
      payload: {
        deviceId,
        devices: response.body.devices
      }
    });
  };
};

export const inviteDevice = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'INVITE_DEVICE_START'
    });

    const state = getState();
    const email = state.user.get('email');
    const organization = state.user.get('organization');
    const storage = readStorage();
    const deviceId = storage[email][organization].deviceId;

    try {
      await requestor.post(`${config.server}/devices`, {
        body: {
          deviceId
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
          return dispatch({
            type: 'INVITE_DEVICE_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
        default:
          return dispatch({
            type: 'INVITE_DEVICE_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    dispatch({
      type: 'INVITE_DEVICE_SUCCESS',
      payload: `Invitation link has been sent to ${email}.`
    });
  };
};

export const getQRCode = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_QR_CODE_START'
    });

    let QRCodeURI;
    QRCode.toDataURL('123', { scale: 10 }, function(error, url) {
      if (error) {
        console.error(error);
        return dispatch({
          type: 'GET_QR_CODE_ERROR',
          payload: 'Unable to generate QRCode'
        });
      }
      QRCodeURI = url;
    });

    dispatch({
      type: 'GET_QR_CODE_SUCCESS',
      payload: QRCodeURI
    });
  };
};

export const deleteDevice = deviceId => {
  return async dispatch => {
    dispatch({
      type: 'DELETE_DEVICE_START'
    });

    try {
      await requestor.delete(`${config.server}/devices`, {
        body: {
          deviceId
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 500:
        case 404:
        default:
          return dispatch({
            type: 'DELETE_DEVICE_ERROR',
            payload: 'Unable to connect to server. Please try again.'
          });
      }
    }

    dispatch({
      type: 'DELETE_DEVICE_SUCCESS',
      payload: `${deviceId} has been deleted.`
    });
  };
};

export default { getQRCode, getDevices, inviteDevice, deleteDevice };
