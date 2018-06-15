const { connect } = require('react-redux');
const SearchView = require('components/devices/DevicesView');
const action = require('actions/devices');

const mapStateToProps = state => {
  return {
    isLoading: state.devices.get('isLoading'),
    error: state.devices.get('error'),
    QRCode: state.devices.get('QRCode')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(action.getDevices());
    },
    onGetQRCode: () => {
      dispatch(action.getQRCode());
    }
  };
};

const DevicesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = DevicesContainer;
