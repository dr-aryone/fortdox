//const requestor = require('@edgeguideab/client-request');
//const config = require('../../config.json');
import QRCode from 'qrcode';

export const getDevices = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'GET_DEVICES_START'
    });

    dispatch({
      type: 'GET_DEVICES_SUCCESS',
      payload: ''
    });
  };
};

export const getQRCode = () => {
  return async (dispatch, getState) => {
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
