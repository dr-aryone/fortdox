import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');
const DocumentTags = require('./DocumentTags');
const BottomPanel = require('./BottomPanel');
const Attachments = require('./Attachments');
const SimilarDocumentsList = require('./SimilarDocumentsList');
const Changelog = require('./Changelog');

const DocumentForm = ({
  onSubmit,
  onUpdateId,
  docFields,
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
  let encryptedTextFields = docFields
    .get('encryptedTexts')
    .map(field => field.set('encrypted', true));
  let textFields = docFields.get('texts');
  let tags = docFields.get('tags');

  //DnD
  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    onUpdateId(result.source.index, result.destination.index);
  };

  let fields = encryptedTextFields
    .concat(textFields)
    .sort((textA, textB) => (textA.get('id') < textB.get('id') ? -1 : 1))
    .map((field, index) => (
      <Draggable key={index} draggableId={index} index={index}>
        {provided => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <DocumentTextArea
                input={field}
                type={field.get('encrypted') ? 'encryptedText' : 'text'}
                key={index}
                onChange={onChange}
                onRemoveField={onRemoveField}
              />
            </div>
          );
        }}
      </Draggable>
    ));

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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='droppable-fields'>
              {provided => <div ref={provided.innerRef}>{fields}</div>}
            </Droppable>
          </DragDropContext>
          <BottomPanel onAddField={onAddField} />
        </div>
        <div className='buttons'>{children}</div>
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
