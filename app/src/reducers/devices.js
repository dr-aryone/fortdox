const { fromJS } = require('immutable');

let initialState = fromJS({
  isLoading: false,
  error: '',
  message: '',
  QRCode: null,
  deviceId: '',
  devices: []
});

const devices = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DEVICES_START':
    case 'GET_QR_CODE_START':
    case 'INVITE_DEVICE_START':
    case 'DELETE_DEVICE_START':
      return state.set('isLoading', true).set('error', '');
    case 'GET_QR_CODE_ERROR':
    case 'GET_DEVICES_ERROR':
    case 'INVITE_DEVICE_ERROR':
    case 'DELETE_DEVICE_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        message: '',
        isLoading: false
      });
    case 'GET_QR_CODE_SUCCESS':
      return state
        .set('isLoading', false)
        .set('QRCode', fromJS(action.payload));
    case 'GET_DEVICES_SUCCESS':
      return state.set('isLoading', false).merge({
        deviceId: fromJS(action.payload.deviceId),
        devices: fromJS(action.payload.devices)
      });
    case 'DELETE_DEVICE_SUCCESS':
    case 'INVITE_DEVICE_SUCCESS':
      return state
        .set('isLoading', false)
        .set('message', fromJS(action.payload));
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = devices;
