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
      content: null,
      showClose: true
    };
  }

  clickHandler() {
    this.fileField.click();
  }

  openModal(attachment, index, onPreviewAttachment) {
    let type = attachment.get('type');
    switch (type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        this.setState({
          showModal: true,
          content: 'image'
        });
        onPreviewAttachment(attachment, index);
        return;
      default:
        this.setState({
          showModal: true,
          content: 'default',
          showClose: false
        });
    }
  }

  closeModal() {
    this.setState({
      showModal: false,
      name: null,
      file: null,
      type: null,
      showClose: true,
      content: null
    });
  }

  downloadHandler(attachment, index) {
    if (this.props.onDownloadAttachment) {
      this.props.onDownloadAttachment(attachment, index);
    }
  }

  render() {
    let {
      attachments,
      preview,
      onAddAttachment,
      onRemoveAttachment,
      onPreviewAttachment
    } = this.props;

    let content;
    switch (this.state.content) {
      case 'image':
        content = [
          <img
            alt='preview-attachment'
            src={`data:${preview.get('type')};base64,${preview.get('data')}`}
            key={0}
          />,
          <h3 key={1}>{preview.get('name')}</h3>
        ];
        break;
      case 'default':
        content = (
          <div className='box dialog'>
            <h2>File can not be previewed.</h2>
            <button onClick={this.closeModal} type='button'>
              ok
            </button>
          </div>
        );
        break;
      default:
        content = null;
    }

    let attachmentList = [];
    attachments.forEach((attachment, index) => {
      let name = attachment.get('name');
      const id = attachment.get('id');
      name = name.replace(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/,
        ''
      ); //Filter the uuid
      let removeButton = onRemoveAttachment ? (
        <button
          className='material-icons round small'
          onClick={() => onRemoveAttachment(id)}
          type='button'
        >
          clear
        </button>
      ) : null;
      attachmentList.push(
        <div key={index}>
          <span
            className='name'
            onClick={() => this.openModal(attachment, id, onPreviewAttachment)}
          >
            {name}
          </span>
          <div className='actions'>
            <span>
              <i
                className='material-icons download'
                onClick={() => this.downloadHandler(attachment, id)}
              >
                file_download
              </i>
            </span>
            {removeButton}
          </div>
        </div>
      );
    });

    let inputs = onAddAttachment ? (
      <div className='upload'>
        <input
          type='file'
          ref={e => (this.fileField = e)}
          onChange={event => onAddAttachment(event)}
          multiple
        />
        <button type='button' onClick={() => this.clickHandler()}>
          Select File
        </button>
      </div>
    ) : null;

    return (
      <div className='attachments'>
        <Modal
          show={this.state.showModal}
          onClose={this.closeModal}
          showClose={this.state.showClose}
        >
          {content}
        </Modal>
        <label>
          <h3>Attachments</h3>
        </label>
        <div className='attachment-list'>{attachmentList}</div>
        {inputs}
      </div>
    );
  }
}

module.exports = Attachments;
