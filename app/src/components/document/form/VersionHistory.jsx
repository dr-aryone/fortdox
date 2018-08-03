import React, { Component } from 'react';

class VersionHistory extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const { versions } = this.props;
    debugger;
    return (
      <div className='version-history-panel'>
        <div className='version-header'>
          <h2>Version History</h2>
        </div>
        <div className='version-list'>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>Current</p>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
          <div className='version-item'>
            <h3>2 August, 2018</h3>
            <p>liliduxx@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }
}

export default VersionHistory;
