import React, { Component } from 'react';
const { formatDate } = require('components/general/formatDate');

class VersionHistory extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const { versions, insertDocumentVersion, onToggleVersionPanel } = this.props;
    const versionList = versions.map((version, index) => {
      return (
        <div
          className={`version-item ${!version.get('title') ? 'disabled' : ''}`}
          key={index}
          onClick={() => {
            if (version.get('title')) insertDocumentVersion(version);
          }}
        >
          <h3>{formatDate(version.get('createdAt'))}</h3>
          <p>{index === versions.size - 1 ? 'Current' : null}</p>
          <p>{version.get('user')}</p>
        </div>
      );
    });

    return (
      <div className='version-history-panel'>
        <div className='version-header'>
          <h2>Version History</h2>
          <span className='close' onClick={() => onToggleVersionPanel(false)}>
            Close
          </span>
        </div>
        <div className='version-list'>{versionList.reverse()}</div>
      </div>
    );
  }
}

export default VersionHistory;
