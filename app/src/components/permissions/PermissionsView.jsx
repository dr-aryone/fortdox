import React, { Component } from 'react';
import LoaderOverlay from 'components/general/LoaderOverlay';
// const ErrorBox = require('components/general/ErrorBox');
// const MessageBox = require('components/general/MessageBox');
// const Modal = require('components/general/Modal');

class PermissionsView extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  componentDidMount() {
    this.props.getPermissionsList();
    this.props.getUserList();
  }

  render() {
    const { isLoading, permissionsList, userList } = this.props;
    const permissions = [];
    permissionsList.forEach(permission => {
      permissions.push(
        <div className='access-cell' key={permission}>
          {permission}
        </div>
      );
    });

    let users = [];
    userList.forEach((user, index) => {
      const checkBoxes = [];
      for (let i = 0; i < permissionsList.size; i++) {
        checkBoxes.push(
          <div className='access-cell' key={`${index}-${i}`}>
            <input type='checkbox' />
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
          {/* <MessageBox message={message} />
          <ErrorBox errorMsg={error} /> */}
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
