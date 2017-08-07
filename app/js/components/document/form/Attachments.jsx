const React = require('react');
const Modal = require('components/general/Modal');

class Attachments extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.downloadHandler = this.downloadHandler.bind(this);

    this.state = {
      showModal: false,
      name: null,
      file: null,
      type: null,
    };
  }

  clickHandler() {
    this.refs.fileField.click();
  }

  openModal(name, file, type) {
    if (type === ('image/jpeg' || 'image/png' || 'image/gif')) this.setState({
      showModal: true,
      name,
      file,
      type
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      name: null,
      file: null,
      type: null,
    });
  }

  downloadHandler () {
    alert('DOWNLOAD');
  }

  render() {
    let {
      attachments,
      onAddAttachment,
      onRemoveAttachment
    } = this.props;

    let attachmentList = [];
    attachments.forEach((attachment, index) => {
      let name = attachment.get('name');
      let file = attachment.get('file');
      let type = attachment.get('type');
      attachmentList.push(
        <div key={index}>
          <span onClick={() => this.openModal(name, file, type)}>{name}</span>
          <span>
            <i className='material-icons download' onClick={this.downloadHandler}>file_download</i>
            <i className='material-icons' onClick={() => onRemoveAttachment(index)}>clear</i>
          </span>
        </div>
      );
    });

    return (
      <div className='attachments'>
        <Modal show={this.state.showModal} onClose={this.closeModal}>
          <img src={`data:${this.state.type};base64,${this.state.file}`} />
          <h3>{this.state.name}</h3>
        </Modal>
        <label>Attachments</label>
        <div className='attachment-list'>
          {attachmentList}
        </div>
        <input type='file' ref='fileField' onChange={event => onAddAttachment(event)} multiple />
        <button type='button' onClick={() => this.clickHandler()}>Select File</button>
      </div>
    );
  }
}

module.exports = Attachments;
