import PermissionsView from 'components/permissions/PermissionsView';
import {
  getPermissionsList,
  getUserPermissionsList,
  updatePermission
} from 'actions/permissions';
import { show } from 'actions/toast';
import React from 'react';
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {
    permissionsList: state.permissions.get('list'),
    userList: state.permissions.get('userList'),
    error: state.permissions.get('error'),
    message: state.permissions.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserList: () => {
      dispatch(getUserPermissionsList());
    },
    getPermissionsList: () => {
      dispatch(getPermissionsList());
    },
    onUpdatePermission: async (email, userPermission, permission, toggle) => {
      await dispatch(
        updatePermission(email, userPermission, permission, toggle)
      );
      dispatch(getUserPermissionsList());
    },
    showMessage: message => {
      dispatch(
        show({
          text: [
            <span key={1}>{message.get('text')} </span>,
            <span key={2} className='highlight'>
              {message.get('user')}
            </span>
          ],
          icon: 'check'
        })
      );
    }
  };
};

const PermissionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsView);

export default PermissionsContainer;
