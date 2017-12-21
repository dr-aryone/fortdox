const React = require('react');
const Modal = require('components/general/Modal');

class Changelog extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      showModal: false
    };
  }

  openModal() {
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  render() {
    let {
      changelog
    } = this.props;

    let changelogBox = [];
    changelog.forEach(entry => {
      changelogBox.push(
        <p key={entry.get('id')}>{entry.get('createdAt')} by {entry.get('user')}</p>
      );
    });

    return (
      <div className='meta-data'>
        <Modal show={this.state.showModal} onClose={this.closeModal} showClose docMode>
          <div className='title'><h2>Changelog</h2></div>
          <div className='text'>
            {changelogBox}
          </div>
        </Modal>
        <label><h3>Created</h3></label>
        <div className='text'>
          {changelog.get(0).get('createdAt')} by {changelog.get(0).get('user')}
        </div>

        <label><h3>Last edited</h3></label>
        <div className='text edit' onClick={() => this.openModal()}>
          {changelog.get(changelog.size-1).get('createdAt')} by {changelog.get(changelog.size - 1).get('user')}
        </div>
      </div>
    );
  }
}

module.exports = Changelog;
