import React, { Component } from 'react';
import LoaderOverlay from 'components/general/LoaderOverlay';
import Toast from 'components/general/Toast';
import ErrorBox from 'components/general/ErrorBox';
import config from 'config.json';
const permissionList = config.permissions;

class PermissionsView extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidUpdate() {
    if (this.props.message) this.props.showMessage(this.props.message);
  }

  componentDidMount() {
    this.props.getPermissionsList();
    this.props.getUserList();
  }

  onCheckBoxChange(email, userPermission, permission, e) {
    this.props.onUpdatePermission(
      email,
      userPermission,
      permission,
      e.target.checked
    );
  }

  render() {
    const {
      isLoading,
      permissionsList,
      userList,
      error,
      superUser,
      currentUser
    } = this.props;

    const permissions = [];
    permissionsList.forEach(permission => {
      permissions.push(
        <div className='access-cell permission centered' key={permission}>
          {permission}
        </div>
      );
    });

    const permissionsKeys = permissionsList.keySeq();
    const users = [];
    userList.forEach((user, index) => {
      const checkBoxes = [];
      for (let i = 0; i < permissionsList.size; i++) {
        const permission = parseInt(permissionsKeys.get(i), 10);
        let isDisabled = false;
        if (!superUser && permissionList[permission] === 'ADMIN')
          isDisabled = true;
        if (
          !superUser &&
          permissionList[user.get('permission') & 1] === 'ADMIN'
        )
          isDisabled = true;
        if (superUser && currentUser === user.get('email')) isDisabled = true;
        checkBoxes.push(
          <div className='access-cell centered' key={`${index}-${i}`}>
            <div className='checkbox'>
              <input
                type='checkbox'
                checked={(user.get('permission') & permission) === permission}
                onChange={e =>
                  this.onCheckBoxChange(
                    user.get('email'),
                    user.get('permission'),
                    permission,
                    e
                  )
                }
                disabled={isDisabled}
              />
              <label />
            </div>
          </div>
        );
      }
      users.push(
        <div className='access-row' key={index}>
          <div className='access-cell'>{user.get('email')}</div>
          {checkBoxes}
        </div>
      );
    });

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <Toast />
          <ErrorBox errorMsg={error} />
          <div className='title'>
            <h1>Access Management</h1>
          </div>
          <div className='access-table'>
            <div className='access-header'>
              <div className='access-cell'>User / Permission</div>
              {permissions}
            </div>
            {users}
          </div>
        </div>
      </div>
    );
  }
}

export default PermissionsView;
