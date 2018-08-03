const React = require('react');
const { formatDate } = require('components/general/formatDate');

class MetaData extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    const { versions, onToggleVersionPanel } = this.props;

    let created = versions.get(0);
    let edited = versions.get(versions.size - 1);
    return (
      <div className='meta-data'>
        <label>
          <h3>Created</h3>
        </label>
        <div className='text'>
          {`${formatDate(created.get('createdAt'))} by ${created.get('user')}`}
        </div>
        <label>
          <h3>Last edited</h3>
        </label>
        <div className='text edit' onClick={() => onToggleVersionPanel()}>
          {`${formatDate(edited.get('createdAt'))} by ${edited.get('user')}`}
        </div>
      </div>
    );
  }
}

module.exports = MetaData;
