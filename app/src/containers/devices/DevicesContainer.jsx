import { connect } from 'react-redux';
const DeviceView = require('components/devices/DevicesView');
const action = require('actions/devices');

const mapStateToProps = state => {
  return {
    isLoading: state.devices.get('isLoading'),
    error: state.devices.get('error'),
    message: state.devices.get('message'),
    QRCode: state.devices.get('QRCode'),
    deviceId: state.devices.get('deviceId'),
    devices: state.devices.get('devices'),
    refresh: state.devices.get('refresh'),
    warning: state.devices.get('warning'),
    maximumReached: state.devices.get('maximumReached')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQRCode: async () => {
      await dispatch(action.getQRCode());
      dispatch(action.getDevices());
    },
    onRefresh: () => {
      dispatch(action.getDevices());
    },
    onMount: () => {
      dispatch(action.getDevices());
    },
    inviteDevice: async () => {
      await dispatch(action.inviteDevice());
      dispatch(action.getDevices());
    },
    onDeleteDevice: async deviceId => {
      await dispatch(action.deleteDevice(deviceId));
      dispatch(action.getDevices());
    },
    onUpdateDeviceName: async (deviceId, deviceName) => {
      await dispatch(action.updateDeviceName(deviceId, deviceName));
      dispatch(action.getDevices());
    }
  };
};

const DevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeviceView);

export default DevicesContainer;
