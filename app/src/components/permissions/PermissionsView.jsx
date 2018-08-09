import React, { Component } from 'react';
import LoaderOverlay from 'components/general/LoaderOverlay';
import Toast from 'components/general/Toast';
import ErrorBox from 'components/general/ErrorBox';
// const MessageBox = require('components/general/MessageBox');
// const Modal = require('components/general/Modal');

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
    const { isLoading, permissionsList, userList, error } = this.props;
    const permissions = [];
    permissionsList.forEach(permission => {
      permissions.push(
        <div className='access-cell' key={permission}>
          {permission}
        </div>
      );
    });

    const permissionsKeys = permissionsList.keySeq();
    let users = [];
    userList.forEach((user, index) => {
      const checkBoxes = [];
      for (let i = 0; i < permissionsList.size; i++) {
        const permission = parseInt(permissionsKeys.get(i), 10);
        checkBoxes.push(
          <div className='access-cell' key={`${index}-${i}`}>
            <input
              type='checkbox'
              checked={(user.get('permission') & permission) === permission}
              onChange={e =>
                this.onCheckBoxChange(
                  user.get('email'),
                  user.get('permission'),
                  parseInt(permissionsKeys.get(i), 10),
                  e
                )
              }
            />
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
          {/* <MessageBox message={message} /> */}
          <ErrorBox errorMsg={error} />
          <div className='title'>
            <h1>Access Management</h1>
          </div>
          <div className='access-table'>
            <div className='access-header'>
              <div className='access-cell'>User/Permission</div>
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
