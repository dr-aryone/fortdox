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
    switch (type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        this.setState({
          showModal: true,
          name,
          file,
          type
        });
        return;
    }
  }

  closeModal() {
    this.setState({
      showModal: false,
      name: null,
      file: null,
      type: null,
    });
  }

  downloadHandler (attachment, index) {
    if (this.props.onDownloadAttachment) {
      this.props.onDownloadAttachment(attachment, index);
    }
  }

  render() {
    let {
      attachments,
      onAddAttachment,
      onRemoveAttachment,
    } = this.props;

    let attachmentList = [];
    attachments.forEach((attachment, index) => {
      let name = attachment.get('name');
      name = name.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/, ''); //Filter the uuid
      let file = attachment.get('file');
      let type = attachment.get('type');
      let removeButton = onRemoveAttachment ?
        <button className='material-icons round small' onClick={() => onRemoveAttachment(index)}>clear</button> : null;
      attachmentList.push(
        <div key={index}>
          <span className='name' onClick={() => this.openModal(name, file, type)}>{name}</span>
          <div className='actions'>
            <span>
              <i className='material-icons download' onClick={() => this.downloadHandler(attachment, index)}>file_download</i>
            </span>
            {removeButton}
          </div>
        </div>
      );
    });

    let inputs = onAddAttachment ? (
      <div className='upload'>
        <input type='file' ref='fileField' onChange={event => onAddAttachment(event)} multiple />
        <button type='button' onClick={() => this.clickHandler()}>Select File</button>
      </div>
    ) : null;

    return (
      <div className='attachments'>
        <Modal show={this.state.showModal} onClose={this.closeModal}>
          <img src={`data:${this.state.type};base64,${this.state.file}`} />
          <h3>{this.state.name}</h3>
        </Modal>
        <label><h3>Attachments</h3></label>
        <div className='attachment-list'>
          {attachmentList}
        </div>
        {inputs}
      </div>
    );
  }
}

module.exports = Attachments;
