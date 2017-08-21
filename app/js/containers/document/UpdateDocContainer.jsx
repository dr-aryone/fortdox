const {connect} = require('react-redux');
const UpdateDocView = require('components/document/UpdateDocView');
const action = require('actions');
const documentActions = require('actions/document');
const attachmentActions = require('actions/document/attachments');

const mapStateToProps = (state) => {
  return {
    docFields: state.updateDocument.get('docFields'),
    error: state.updateDocument.get('error'),
    isLoading: state.updateDocument.get('isLoading'),
    similarDocuments: state.updateDocument.get('similarDocuments')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event, type) => {
      dispatch(documentActions.docInputChange(event.target.name, event.target.value, type));
    },
    onTitleChange: (event) => {
      dispatch(documentActions.docTitleChange(event.target.value));
    },
    onSuggestTags: event => {
      dispatch(documentActions.suggestTags(event.target.value));
    },
    onUpdate: (event) => {
      event.preventDefault();
      dispatch(documentActions.updateDocument());
    },
    toSearchView: () => {
      dispatch(action.changeView('SEARCH_VIEW'));
    },
    onDelete: () => {
      dispatch(documentActions.deleteDocument());
    },
    onAddTag: tag => {
      dispatch(documentActions.addTag(tag));
    },
    onRemoveTag: tagIndex => {
      dispatch(documentActions.removeTag(tagIndex));
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
    onDownloadAttachment: (attachment, attachmentIndex) => {
      dispatch(attachmentActions.downloadAttachment(attachment, attachmentIndex));
    },
    onCloseSimilarDocuments: () => {
      dispatch(documentActions.clearSimilarDocuments());
    },
    onSimilarDocumentClick: id => {
      dispatch(documentActions.openDocument(id));
    }
  };
};

const UpdateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocView);

module.exports = UpdateDocContainer;
