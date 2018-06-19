const { fromJS } = require('immutable');

let initialState = fromJS({
  isLoading: false,
  error: '',
  QRCode: null,
  deviceId: '',
  devices: []
});

const devices = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DEVICES_START':
    case 'GET_QR_CODE_START':
      return state.set('isLoading', true).set('error', '');
    case 'GET_QR_CODE_ERROR':
    case 'GET_DEVICES_ERROR':
      return state.set('isLoading', false).set('error', action.payload);
    case 'GET_QR_CODE_SUCCESS':
      return state.set('isLoading', false).set('QRCode', action.payload);
    case 'GET_DEVICES_SUCCESS':
      return state.set('isLoading', false).merge({
        deviceId: fromJS(action.payload.deviceId),
        devices: fromJS(action.payload.devices)
      });
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = devices;
