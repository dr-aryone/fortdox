const React = require('react');
const Modal = require('components/general/Modal');

class Changelog extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.state = {
      showModal: false
    };
  }

  clickHandler() {
    this.refs.fileField.click();
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
    // let changelog = this.state.props;


    return (
      <div>
        <Modal show={this.state.showModal} onClose={this.closeModal}>
          <h2> Edits </h2>
        </Modal>
        <label><h3>Created</h3></label>
        <div className='text'>
          DATE by SOMEONE
        </div>

        <label><h3>Edited</h3></label>
        <div className='text'>
          DATE by SOMEONE
        </div>
      </div>
    );
  }
}

module.exports = Changelog;
