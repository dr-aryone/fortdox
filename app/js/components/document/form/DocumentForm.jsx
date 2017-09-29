const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');
const DocumentTags = require('./DocumentTags');
const BottomPanel = require('./BottomPanel');
const Attachments = require('./Attachments');
const SimilarDocumentsList = require('./SimilarDocumentsList');

const DocumentForm = ({
  onSubmit,
  docFields,
  onChange,
  onTitleChange,
  onSuggestTags,
  onAddTag,
  onRemoveTag,
  onAddField,
  onRemoveField,
  onAddAttachment,
  onRemoveAttachment,
  onDownloadAttachment,
  children,
  similarDocuments,
  onCloseSimilarDocuments,
  onSimilarDocumentClick
}) => {
  let title = docFields.get('title');
  let encryptedTextFields = docFields.get('encryptedTexts')
    .map(field => field.set('encrypted', true));
  let textFields = docFields.get('texts');
  let tags = docFields.get('tags');

  let fields = encryptedTextFields
    .concat(textFields)
    .sort((textA, textB) => textA.get('id') < textB.get('id') ? -1 : 1)
    .map((field, index) => (
      <DocumentTextArea
        input={field}
        type={field.get('encrypted') ? 'encryptedText' : 'text'}
        key={index}
        onChange={onChange}
        onRemoveField={onRemoveField}
      />
    )
  );

  return (
    <form onSubmit={onSubmit} className='document'>
      <div className='main-panel'>
        <div>
          <div className='title-container'>
            <DocumentInputField
              input={title}
              type='text'
              key='title'
              onChange={event => {
                onChange(event, 'title');
                onTitleChange(event);
              }}
            />
            <SimilarDocumentsList
              list={similarDocuments}
              onClose={onCloseSimilarDocuments}
              onClick={onSimilarDocumentClick}
            />
          </div>
          {fields}
          <BottomPanel onAddField={onAddField} />
        </div>
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
          onDownloadAttachment={onDownloadAttachment}
        />
      </div>
    </form>
  );
};

module.exports = DocumentForm;
