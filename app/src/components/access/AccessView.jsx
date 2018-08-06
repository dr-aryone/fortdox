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
          <div className='access-matrix'>
            <div className='row matrix-header'>
              <div className='user'>User/Right</div>
              <div>Invite User</div>
              <div>Remove User</div>
              <div>Delete Document</div>
              <div>Superuser</div>
            </div>
            <div className='row'>
              <div>bajs@gmail.com</div>
              <div>
                <input type='checkbox' />
              </div>
              <div>
                <input type='checkbox' />
              </div>
              <div>
                <input type='checkbox' />
              </div>
              <div>
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
