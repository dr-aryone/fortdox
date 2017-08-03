const React = require('react');

class Attachments extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.refs.fileField.click();
  }

  render() {
    let {
      attachments,
      onAddAttachment,
      onRemoveAttachment
    } = this.props;

    let attachmentList = [];
    attachments.forEach((attachment, index) => {
      attachmentList.push(
        <div key={index}>
          <span>{attachment.get('name')}</span>
          <i className='material-icons' onClick={() => onRemoveAttachment(index)}>clear</i>
        </div>
      );
    });

    return (
      <div className='attachments'>
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
