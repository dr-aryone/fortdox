import TextAreaContainer from './TextAreaContainer';
const React = require('react');
const InputField = require('./InputField');
const Tags = require('./Tags');
const BottomPanel = require('./BottomPanel');
const Attachments = require('./Attachments');
const SimilarDocumentsList = require('./SimilarDocumentsList');
const Changelog = require('./Changelog');

const DocumentForm = ({
  onSubmit,
  onUpdateId,
  docFields,
  onDrop,
  onHideElement,
  elementToHide,
  changelog,
  onChange,
  onTitleChange,
  onSuggestTags,
  onAddTag,
  onRemoveTag,
  onAddField,
  onRemoveField,
  onAddAttachment,
  onRemoveAttachment,
  onPreviewAttachment,
  onDownloadAttachment,
  children,
  similarDocuments,
  onCloseSimilarDocuments,
  onSimilarDocumentClick
}) => {
  let title = docFields.get('title');
  let tags = docFields.get('tags');

  return (
    <form onSubmit={onSubmit} className='document'>
      <div className='main-panel'>
        <div>
          <div className='title-container'>
            <InputField
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
          <TextAreaContainer
            docFields={docFields}
            onRemoveField={onRemoveField}
            onChange={onChange}
            onUpdateId={onUpdateId}
            onDrop={onDrop}
            onHideElement={onHideElement}
            elementToHide={elementToHide}
          />
          <BottomPanel onAddField={onAddField} />
        </div>
        <div className='buttons'>{children}</div>
      </div>
      <div className='side-panel box'>
        <Tags
          onChange={onSuggestTags}
          tags={tags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
        <Attachments
          attachments={docFields.get('attachments')}
          preview={docFields.get('preview')}
          onAddAttachment={onAddAttachment}
          onRemoveAttachment={onRemoveAttachment}
          onPreviewAttachment={onPreviewAttachment}
          onDownloadAttachment={onDownloadAttachment}
        />
        {changelog ? (
          <Changelog changelog={docFields.get('changelog')} />
        ) : null}
      </div>
    </form>
  );
};

export default DocumentForm;
