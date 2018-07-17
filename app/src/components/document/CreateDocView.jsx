import DocumentForm from './form/DocumentForm';
const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

class CreateDocView extends React.Component {
  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
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

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <ErrorBox errorMsg={error} />
          <h1>Create Document</h1>
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
            <button onClick={onCreate} type='submit'>
              Create
            </button>
            <button onClick={onCancel} type='submit'>
              Cancel
            </button>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

export default CreateDocView;
