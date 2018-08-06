import React, { Component } from 'react';
// const ErrorBox = require('components/general/ErrorBox');
// const LoaderOverlay = require('components/general/LoaderOverlay');
// const MessageBox = require('components/general/MessageBox');
// const Modal = require('components/general/Modal');

class AccessView extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          {/* <LoaderOverlay display={isLoading} />
          <MessageBox message={message} />
          <ErrorBox errorMsg={error} /> */}
          <div className='title'>
            <h1>Access Management</h1>
          </div>
          <div className='access-table'>
            <div className='access-header'>
              <div className='access-cell'>User/Permission</div>
              <div className='access-cell'>Invite User</div>
              <div className='access-cell'>Remove User</div>
              <div className='access-cell'>Delete Document</div>
              <div className='access-cell'>Grant Permission</div>
            </div>
            <div className='access-row'>
              <div className='access-cell'>bajs@gmail.com</div>
              <div className='access-cell'>
                <input type='checkbox' />
              </div>
              <div className='access-cell'>
                <input type='checkbox' />
              </div>
              <div className='access-cell'>
                <input type='checkbox' />
              </div>
              <div className='access-cell'>
                <input type='checkbox' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccessView;
