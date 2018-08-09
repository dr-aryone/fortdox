import PermissionsView from 'components/permissions/PermissionsView';
const { connect } = require('react-redux');

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

const PermissionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsView);

export default PermissionsContainer;
