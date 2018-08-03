const React = require('react');
const { Map } = require('immutable');
const { formatDate } = require('components/general/formatDate');

class Changelog extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    const { changelog = Map(), onToggleVersionPanel } = this.props;

    return (
      <div className='meta-data'>
        <label>
          <h3>Created</h3>
        </label>
        <div className='text'>
          {formatDate(changelog.getIn([0, 'createdAt']))} by{' '}
          {changelog.getIn([0, 'user'])}
        </div>
        <label>
          <h3>Last edited</h3>
        </label>
        <div className='text edit' onClick={() => onToggleVersionPanel()}>
          {formatDate(changelog.getIn([changelog.size - 1, 'createdAt']))} by{' '}
          {changelog.getIn([changelog.size - 1, 'user'])}
        </div>
      </div>
    );
  }
}

module.exports = Changelog;
