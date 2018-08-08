import DocumentForm from './form/DocumentForm';
import VersionHistory from './form/VersionHistory';
import { markdownToHtml } from 'actions/document/utilities';
const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const Modal = require('components/general/Modal');

class UpdateDocView extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
    this.hasBeenEdited = this.hasBeenEdited.bind(this);
    this.state = {
      showDeleteDialog: false,
      showEditDialog: false,
      nextView: null,
      hasBeenEdited: false
    };
  }

  componentWillReceiveProps(
    { checkFields, nextViewAfterCheck, docFields } = this.props
  ) {
    if (checkFields) {
      if (this.hasBeenEdited(this.props.docFields)) {
        return this.setState({
          showEditDialog: true,
          nextView: nextViewAfterCheck
        });
      }

      return this.props.hasChecked();
    }

    if (docFields && this.props.oldDocFields)
      return this.setState({
        hasBeenEdited: this.hasBeenEdited(docFields)
      });
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  openDeleteDialog() {
    this.setState({
      showDeleteDialog: true
    });
  }

  closeDeleteDialog() {
    this.setState({
      showDeleteDialog: false
    });
  }

  hasBeenEdited(docFields) {
    const title = docFields.getIn(['title', 'value']);
    const encryptedTexts = docFields.get('encryptedTexts');
    const texts = docFields.get('texts');
    const tags = docFields.getIn(['tags', 'list']);
    const attachments = docFields.get('attachments');
    const oldDoc = this.props.oldDocFields;
    const oldTitle = oldDoc.getIn(['title', 'value']);
    const oldEncryptedTexts = oldDoc.get('encryptedTexts');
    const oldTexts = oldDoc.get('texts');
    const oldTags = oldDoc.getIn(['tags', 'list']);
    const oldAttachments = oldDoc.get('attachments');

    if (title.trim() !== oldTitle.trim()) return true;

    if (encryptedTexts.size === oldEncryptedTexts.size) {
      if (
        encryptedTexts.find((text, index) => {
          if (text.get('format') === 'markdown')
            return (
              markdownToHtml(text.get('value')).trim() !==
              oldEncryptedTexts
                .get(index)
                .get('value')
                .trim()
            );
          return (
            text.get('value').trim() !==
            oldEncryptedTexts
              .get(index)
              .get('value')
              .trim()
          );
        })
      )
        return true;
    } else return true;

    if (texts.size === oldTexts.size) {
      if (
        texts.find((text, index) => {
          if (text.get('format') === 'markdown')
            return (
              markdownToHtml(text.get('value')).trim() !==
              oldTexts
                .get(index)
                .get('value')
                .trim()
            );
          return (
            text.get('value').trim() !==
            oldTexts
              .get(index)
              .get('value')
              .trim()
          );
        })
      )
        return true;
    } else return true;

    if (tags.size === oldTags.size) {
      if (
        tags.find((tag, index) => {
          return tag !== oldTags.get(index);
        })
      )
        return true;
    } else return true;

    if (attachments.size === oldAttachments.size) {
      if (
        attachments.find((attachment, index) => {
          const oldAttachment = oldAttachments.get(index);
          if (attachment.get('name') !== oldAttachment.get('name')) return true;
          if (attachment.get('type') !== oldAttachment.get('type')) return true;
          if (attachment.get('file') !== oldAttachment.get('file')) return true;
          return false;
        })
      )
        return true;
    } else return true;

    return false;
  }

  checkEdits(docFields) {
    if (!this.hasBeenEdited(docFields))
      return this.props.hasChecked('SEARCH_VIEW');
    return this.setState({
      showEditDialog: true
    });
  }

  closeEditDialog() {
    return this.setState({
      showEditDialog: false,
      nextView: null
    });
  }

  render() {
    let {
      docFields,
      error,
      onUpdateId,
      onAddTag,
      onRemoveTag,
      onChange,
      onSuggestTags,
      onUpdate,
      onDelete,
      onAddField,
      onRemoveField,
      onAddAttachment,
      onRemoveAttachment,
      onPreviewAttachment,
      onDownloadAttachment,
      isLoading,
      onTitleChange,
      similarDocuments,
      onCloseSimilarDocuments,
      onSimilarDocumentClick,
      onDrop,
      onHideElement,
      elementToHide,
      showVersionPanel,
      onToggleVersionPanel,
      onInsertDocumentVersion,
      onConvert
    } = this.props;

    const deleteDialog = (
      <Modal
        show={this.state.showDeleteDialog}
        onClose={this.closeDeleteDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>Are you sure you want to delete the document?</p>
          <div className='doc-buttons'>
            <button onClick={this.closeDeleteDialog} type='button'>
              Cancel
            </button>
            <button onClick={onDelete} type='button' className='warning'>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    );

    const editedDialog = (
      <Modal
        show={this.state.showEditDialog}
        onClose={this.closeEditDialog}
        showClose={false}
      >
        <div className='box dialog warning'>
          <i className='material-icons'>error_outline</i>
          <h2>Document has been changed.</h2>
          <p>Do you want to save your changes?</p>
          <div className='buttons'>
            <button
              onClick={() =>
                this.props.hasChecked(
                  this.state.nextView ? this.state.nextView : 'SEARCH_VIEW'
                )
              }
              className='first-button'
              type='button'
            >
              {'Don\'t save'}
            </button>
            <button
              onClick={() => {
                this.closeEditDialog();
                this.props.onUnCheckField();
              }}
              type='button'
            >
              Cancel
            </button>
            <button
              onClick={e => {
                this.closeEditDialog();
                onUpdate(e);
              }}
              type='button'
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    );

    return (
      <div className='container-fluid'>
        <LoaderOverlay display={isLoading} />
        {deleteDialog}
        {editedDialog}
        <div
          className={`update-view inner-container document-panel ${
            showVersionPanel ? 'small' : 'full'
          } `}
        >
          <div className={`${showVersionPanel ? 'document-container' : ''}`}>
            <ErrorBox errorMsg={error} />
            <h1 className='doc-header'>
              <button type='button' onClick={() => this.checkEdits(docFields)}>
                Back
              </button>
              Update Document
            </h1>
            <DocumentForm
              onUpdateId={onUpdateId}
              docFields={docFields}
              versions={docFields.get('versions')}
              similarDocuments={similarDocuments}
              onCloseSimilarDocuments={onCloseSimilarDocuments}
              onSimilarDocumentClick={onSimilarDocumentClick}
              onChange={onChange}
              onTitleChange={onTitleChange}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onSuggestTags={onSuggestTags}
              onSubmit={onUpdate}
              onAddField={onAddField}
              onRemoveField={onRemoveField}
              onAddAttachment={onAddAttachment}
              onRemoveAttachment={onRemoveAttachment}
              onPreviewAttachment={onPreviewAttachment}
              onDownloadAttachment={onDownloadAttachment}
              onDrop={onDrop}
              onHideElement={onHideElement}
              elementToHide={elementToHide}
              onToggleVersionPanel={onToggleVersionPanel}
              onConvert={onConvert}
            >
              <div className='doc-buttons update'>
                <button
                  onClick={this.openDeleteDialog}
                  type='button'
                  className='warning'
                >
                  Delete
                </button>
                <span>
                  <button
                    type='button'
                    onClick={() => this.checkEdits(docFields)}
                  >
                    Back
                  </button>
                  <button
                    onClick={onUpdate}
                    type='submit'
                    disabled={!this.state.hasBeenEdited}
                  >
                    Update
                  </button>
                </span>
              </div>
            </DocumentForm>
          </div>
          {showVersionPanel && (
            <VersionHistory
              showVersionPanel={showVersionPanel}
              versions={docFields.get('versions')}
              onToggleVersionPanel={onToggleVersionPanel}
              onInsertDocumentVersion={onInsertDocumentVersion}
            />
          )}
        </div>
      </div>
    );
  }
}

export default UpdateDocView;
