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
      showEditDialog: false,
      nextView: null
    };
  }

  componentWillReceiveProps({ checkFields, nextViewAfterCheck } = this.props) {
    if (checkFields) {
      if (this.hasBeenEdited(this.props.docFields)) {
        return this.setState({
          showEditDialog: true,
          nextView: nextViewAfterCheck
        });
      }

      return this.props.hasChecked();
    }
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  closeEditDialog() {
    return this.setState({
      showEditDialog: false,
      nextView: null
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
    if (!this.hasBeenEdited(docFields))
      return this.props.hasChecked('SEARCH_VIEW');

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
      onUnCheckField,
      onConvert
    } = this.props;

    let editedDialog = (
      <Modal
        show={this.state.showEditDialog}
        onClose={this.closeEditDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Document has been changed.</h2>
          <p>Do you want to save your changes?</p>
          <div className='buttons'>
            <button
              className='first-button warning'
              onClick={() =>
                this.props.hasChecked(
                  this.state.nextView ? this.state.nextView : 'SEARCH_VIEW'
                )
              }
              type='button'
            >
              {'Don\'t Save'}
            </button>
            <button
              onClick={() => {
                onUnCheckField();
                this.closeEditDialog();
              }}
              type='button'
              className='neutral'
            >
              Cancel
            </button>
            <button
              onClick={e => {
                onCreate(e);
                this.closeEditDialog();
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
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <ErrorBox errorMsg={error} />
        {editedDialog}
        <h1 className='doc-header'>
          <button
            type='button'
            onClick={() => this.checkEdits(docFields)}
            className='neutral'
          >
            Back
          </button>
          Create Document
        </h1>
        <DocumentForm
          titleAutofocus
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
          onConvert={onConvert}
        >
          <div className='doc-buttons'>
            <button
              onClick={() => this.checkEdits(docFields)}
              type='button'
              className='neutral'
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              type='submit'
              disabled={!this.hasBeenEdited(docFields)}
            >
              Create
            </button>
          </div>
        </DocumentForm>
      </div>
    );
  }
}

export default CreateDocView;
