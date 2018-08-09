import PermissionsView from 'components/permissions/PermissionsView';
import {
  getPermissionsList,
  getUserPermissionsList
} from 'actions/permissions';
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {
    permissionsList: state.permissions.get('list'),
    userList: state.permissions.get('userList')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserList: () => {
      dispatch(getUserPermissionsList());
    },
    getPermissionsList: () => {
      dispatch(getPermissionsList());
    }
  };
};

const PermissionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsView);

export default PermissionsContainer;
