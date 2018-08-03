const { fromJS } = require('immutable');

let initialState = fromJS({
  isLoading: false,
  error: '',
  message: '',
  QRCode: null,
  deviceId: '',
  devices: [],
  refresh: false,
  warning: null,
  maximumReached: false
});

const devices = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DEVICES_START':
    case 'GET_QR_CODE_START':
    case 'INVITE_DEVICE_START':
    case 'DELETE_DEVICE_START':
    case 'UPDATE_DEVICE_NAME_START':
      return state.set('isLoading', true);
    case 'GET_QR_CODE_ERROR':
    case 'GET_DEVICES_ERROR':
    case 'INVITE_DEVICE_ERROR':
    case 'DELETE_DEVICE_ERROR':
    case 'UPDATE_DEVICE_NAME_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        message: '',
        isLoading: false
      });
    case 'GET_QR_CODE_SUCCESS':
      return state
        .set('isLoading', false)
        .set('QRCode', fromJS(action.payload))
        .set('message', null)
        .set('error', null);
    case 'GET_DEVICES_SUCCESS':
      return state.set('isLoading', false).merge({
        deviceId: fromJS(action.payload.deviceId),
        devices: fromJS(action.payload.devices),
        warning: fromJS(action.payload.warningText),
        maximumReached: fromJS(action.payload.maximumReached),
        refresh: false
      });
    case 'UPDATE_DEVICE_NAME_SUCCESS':
    case 'DELETE_DEVICE_SUCCESS':
    case 'INVITE_DEVICE_SUCCESS':
      return state
        .set('isLoading', false)
        .set('message', fromJS(action.payload));
    case 'CHANGE_VIEW':
      if (action.payload === 'DEVICES_VIEW') {
        return state.set('refresh', true);
      } else {
        return initialState;
      }
    default:
      return state;
  }
};

module.exports = devices;
