import React, { Component } from 'react';
import DocumentForm from './form/DocumentForm';
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const Modal = require('components/general/Modal');

class CreateDocView extends Component {
  constructor(props) {
    super(props);
    this.closeEditDialog = this.closeEditDialog.bind(this);
    this.hasBeenEdited = this.hasBeenEdited.bind(this);
    this.state = {
      showEditDialog: false
    };
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  closeEditDialog() {
    return this.setState({
      showEditDialog: false
    });
  }

  hasBeenEdited(docFields) {
    const title = docFields.getIn(['title', 'value']);
    const encryptedTexts = docFields.get('encryptedTexts');
    const texts = docFields.get('texts');
    const tags = docFields.getIn(['tags', 'list']);
    const attachments = docFields.get('attachments');
    if (title.trim() !== '') return true;
    if (
      encryptedTexts.find(text => {
        return text.get('value').trim() !== '';
      })
    )
      return true;

    if (
      texts.find(text => {
        return text.get('value').trim() !== '';
      })
    )
      return true;
    if (tags.size !== 0) return true;
    if (attachments.size !== 0) return true;

    return false;
  }

  checkEdits(docFields) {
    if (!this.hasBeenEdited(docFields)) return this.props.onCancel();

    return this.setState({
      showEditDialog: true
    });
  }

  render() {
    let {
      onUpdateId,
      docFields,
      onDrop,
      onHideElement,
      error,
      elementToHide,
      onAddTag,
      onRemoveTag,
      onChange,
      onTitleChange,
      onSuggestTags,
      onCreate,
      onAddField,
      onRemoveField,
      onAddAttachment,
      onRemoveAttachment,
      onPreviewAttachment,
      onDownloadAttachment,
      isLoading,
      similarDocuments,
      onCloseSimilarDocuments,
      onSimilarDocumentClick,
      onCancel
    } = this.props;

    let editedDialog = (
      <Modal
        show={this.state.showEditDialog}
        onClose={this.closeEditDialog}
        showClose={false}
      >
        <div className='box dialog warning'>
          <i className='material-icons'>warning</i>
          <h2>Document has been changed.</h2>
          <p>Do you want to save your changes?</p>
          <div className='buttons'>
            <button className='first-button' onClick={onCancel} type='button'>
              {'Don\'t Save'}
            </button>
            <button onClick={this.closeEditDialog} type='button'>
              Cancel
            </button>
            <button
              onClick={e => {
                this.closeEditDialog();
                onCreate(e);
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
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <ErrorBox errorMsg={error} />
          {editedDialog}
          <h1 className='doc-header'>
            <button type='button' onClick={() => this.checkEdits(docFields)}>
              Back
            </button>
            Create Document
          </h1>
          <DocumentForm
            onUpdateId={onUpdateId}
            docFields={docFields}
            elementToHide={elementToHide}
            similarDocuments={similarDocuments}
            onCloseSimilarDocuments={onCloseSimilarDocuments}
            onSimilarDocumentClick={onSimilarDocumentClick}
            onChange={onChange}
            onTitleChange={onTitleChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSuggestTags={onSuggestTags}
            onSubmit={onCreate}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
            onAddAttachment={onAddAttachment}
            onRemoveAttachment={onRemoveAttachment}
            onPreviewAttachment={onPreviewAttachment}
            onDownloadAttachment={onDownloadAttachment}
            onDrop={onDrop}
            onHideElement={onHideElement}
          >
            <div className='doc-buttons'>
              <button onClick={() => this.checkEdits(docFields)} type='button'>
                Cancel
              </button>
              <button onClick={onCreate} type='submit'>
                Create
              </button>
            </div>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

export default CreateDocView;
