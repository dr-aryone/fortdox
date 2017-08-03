const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');
const DocumentTags = require('./DocumentTags');
const BottomPanel = require('./BottomPanel');
const Attachments = require('./Attachments');

const DocumentForm = ({
  onSubmit,
  docFields,
  onChange,
  onSuggestTags,
  onAddTag,
  onRemoveTag,
  onAddField,
  onRemoveField,
  onAddAttachment,
  onRemoveAttachment,
  children
}) => {
  let fields = [];
  let title = docFields.get('title');
  let encryptedTextFields = docFields.get('encryptedTexts');
  let textFields = docFields.get('texts');
  let tags = docFields.get('tags');
  let size = encryptedTextFields.size + textFields.size;
  fields.push(<DocumentInputField input={title} type='title' key='title' onChange={onChange} />);
  for (let i = 0; i < size; i++) {
    if (encryptedTextFields.size === 0) {
      fields.push(
        <DocumentTextArea
          input={textFields.first()}
          type='text'
          key={i}
          onChange={onChange}
          onRemoveField={onRemoveField}
        />
      );
      textFields = textFields.shift();
    } else if (textFields.size === 0) {
      fields.push(
        <DocumentTextArea
          input={encryptedTextFields.first()}
          type='encryptedText'
          key={i}
          onChange={onChange}
          onRemoveField={onRemoveField}
        />
      );
      encryptedTextFields = encryptedTextFields.shift();
    } else {
      let encryptedID = encryptedTextFields.first().get('id');
      let textID = textFields.first().get('id');
      if (encryptedID < textID) {
        fields.push(
          <DocumentTextArea
            input={encryptedTextFields.first()}
            type='encryptedText'
            key={i}
            onChange={onChange}
            onRemoveField={onRemoveField}
          />
        );
        encryptedTextFields = encryptedTextFields.shift();
      } else {
        fields.push(
          <DocumentTextArea
            input={textFields.first()}
            type='text'
            key={i}
            onChange={onChange}
            onRemoveField={onRemoveField}
          />
        );
        textFields = textFields.shift();
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className='document'>
      <div className='main-panel box'>
        {fields}
        <BottomPanel onAddField={onAddField} />
        <div className='buttons'>
          {children}
        </div>
      </div>
      <div className='side-panel box'>
        <DocumentTags
          onChange={onSuggestTags}
          tags={tags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
        <Attachments
          attachments={docFields.get('attachments')}
          onAddAttachment={onAddAttachment}
          onRemoveAttachment={onRemoveAttachment}
        />
      </div>
    </form>
  );
};

module.exports = DocumentForm;
