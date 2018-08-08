import React, { Component } from 'react';
const { formatDate } = require('components/general/formatDate');

class VersionHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentVersion: 0
    };
  }

  onVersionItemClick(version, index) {
    if (version.get('title')) {
      this.props.onInsertDocumentVersion(version);
      this.setState({
        currentVersion: index
      });
    }
  }

  render() {
    const { versions, onToggleVersionPanel, showVersionPanel } = this.props;
    let versionList;
    if (versions) {
      const versionsReversed = versions.reverse();
      versionList = versionsReversed.map((version, index) => {
        return (
          <div
            className={`version-item ${
              !version.get('title') ? 'disabled' : ''
            } ${this.state.currentVersion === index ? 'selected' : ''}`}
            key={index}
            onClick={() => this.onVersionItemClick(version, index)}
          >
            <h3>{formatDate(version.get('createdAt'))}</h3>
            <p>{index === 0 ? 'Current version' : null}</p>
            <p>{version.get('user')}</p>
          </div>
        );
      });
    }

    return (
      <div
        className={`version-history-panel ${
          showVersionPanel !== undefined ? showVersionPanel ? 'show' : 'hide' : ''
        }`}
      >
        <div className='version-header'>
          <h2>Version History</h2>
          <span className='close' onClick={() => onToggleVersionPanel(false)}>
            Close
          </span>
        </div>
        <div className='version-list'>{versionList}</div>
      </div>
    );
  }
}

export default VersionHistory;
