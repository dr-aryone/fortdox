const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');
const ErrorBox = require('components/general/ErrorBox');

class UpdateDocView extends React.Component {
  componentWillMount () {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  render () {
    let {
      docFields,
      error,
      onAddTag,
      onRemoveTag,
      onChange,
      onSuggestTags,
      onUpdate,
      onAddField,
      onRemoveField,
      onAddAttachment,
      onRemoveAttachment,
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
        <div className={`update-view inner-container ${isLoading ? 'hide' : ''}`}>
          <ErrorBox errorMsg={error} />
          <h1>Update Document</h1>
          <DocumentForm
            docFields={docFields}
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
            onDownloadAttachment={onDownloadAttachment}
          >
            <button onClick={onUpdate} type='submit'>Update</button>
            <button onClick={toSearchView} type='button'>Back</button>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

module.exports = UpdateDocView;
