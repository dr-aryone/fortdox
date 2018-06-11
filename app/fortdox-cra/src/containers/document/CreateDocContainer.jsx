import documentActions from 'actions/document';
const { connect } = require('react-redux');
const CreateDocView = require('../../components/document/CreateDocView');
const action = require('../../actions');

const mapStateToProps = state => {
  return {
    docFields: state.createDocument.get('docFields'),
    error: state.createDocument.get('error'),
    isLoading: state.createDocument.get('isLoading'),
    similarDocuments: state.updateDocument.get('similarDocuments')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event, type) => {
      dispatch(
        documentActions.docInputChange(
          event.target.name,
          event.target.value,
          type
        )
      );
    },
    onTitleChange: event => {
      dispatch(documentActions.docTitleChange(event.target.value));
    },
    onSuggestTags: event => {
      dispatch(documentActions.suggestTags(event.target.value));
    },
    onCreate: event => {
      event.preventDefault();
      dispatch(documentActions.createDocument());
    },
    onCancel: () => {
      dispatch(action.changeView('SEARCH_VIEW'));
    },
    onAddTag: tag => {
      dispatch(documentActions.addTag(tag));
    },
    onRemoveTag: tag => {
      dispatch(documentActions.removeTag(tag));
    },
    setTagIndex: index => {
      dispatch(documentActions.setTagIndex(index));
    },
    onMount: () => {
      dispatch(documentActions.getOldTags());
    },
    onAddField: field => {
      dispatch(documentActions.addField(field));
    },
    onRemoveField: id => {
      dispatch(documentActions.removeField(id));
    },
    onAddAttachment: event => {
      dispatch(documentActions.addAttachment(event.target.files));
    },
    onRemoveAttachment: id => {
      dispatch(documentActions.removeAttachment(id));
    },
    onPreviewAttachment: (attachment, attachmentIndex) => {
      dispatch(documentActions.previewAttachment(attachment, attachmentIndex));
    },
    onDownloadAttachment: (attachment, attachmentIndex) => {
      dispatch(documentActions.downloadAttachment(attachment, attachmentIndex));
    },
    onCloseSimilarDocuments: () => {
      dispatch(documentActions.clearSimilarDocuments());
    },
    onSimilarDocumentClick: id => {
      dispatch(action.changeView('UPDATE_DOC_VIEW'));
      dispatch(documentActions.openDocument(id));
    }
  };
};

const CreateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocView);

export default CreateDocContainer;
