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

export default { getQRCode, getDevices };
