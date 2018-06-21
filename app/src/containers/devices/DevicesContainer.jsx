const { connect } = require('react-redux');
const SearchView = require('components/devices/DevicesView');
const action = require('actions/devices');

const mapStateToProps = state => {
  return {
    isLoading: state.devices.get('isLoading'),
    error: state.devices.get('error'),
    message: state.devices.get('message'),
    QRCode: state.devices.get('QRCode'),
    deviceId: state.devices.get('deviceId'),
    devices: state.devices.get('devices')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(action.getDevices());
    },
    inviteDevice: () => {
      dispatch(action.inviteDevice());
    }
  };
};

const DevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = DevicesContainer;
