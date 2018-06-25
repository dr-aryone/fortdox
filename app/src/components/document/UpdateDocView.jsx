import DocumentForm from './form/DocumentForm';
const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const Modal = require('components/general/Modal');

class UpdateDocView extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      showModal: false
    };
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  openModal() {
    this.setState({
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
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
      toSearchView,
      onTitleChange,
      similarDocuments,
      onCloseSimilarDocuments,
      onSimilarDocumentClick
    } = this.props;

    return (
      <div className='container-fluid'>
        <LoaderOverlay display={isLoading} />
        <div
          className={`update-view inner-container ${isLoading ? 'hide' : ''}`}
        >
          <ErrorBox errorMsg={error} />
          <h1>Update Document</h1>
          <DocumentForm
            onUpdateId={onUpdateId}
            docFields={docFields}
            changelog={docFields.get('changelog')}
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
          >
            <button onClick={onUpdate} type='submit'>
              Update
            </button>
            <button onClick={toSearchView} type='button'>
              Back
            </button>
            <button onClick={this.openModal} type='button' className='warning'>
              Delete
            </button>
          </DocumentForm>
          <Modal
            show={this.state.showModal}
            onClose={this.closeModal}
            showClose={false}
          >
            <div className='box dialog'>
              <i className='material-icons'>error_outline</i>
              <h2>Warning</h2>
              <p>Are you sure you want to delete the document?</p>
              <div className='buttons'>
                <button onClick={onDelete} type='button' className='warning'>
                  Delete
                </button>
                <button onClick={this.closeModal} type='button'>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default UpdateDocView;
