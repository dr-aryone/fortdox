import {
  Document as documentActions,
  Tags as tagActions,
  Fields as fieldActions,
  Attachments as attachmentActions
} from 'actions/document';
import CreateDocView from '../../components/document/CreateDocView';

const { connect } = require('react-redux');
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
    onUpdateId: (fromId, toId) => {
      dispatch(fieldActions.updateFieldPositon(fromId, toId));
    },
    onChange: (event, type) => {
      dispatch(
        fieldActions.docInputChange(event.target.name, event.target.value, type)
      );
    },
    onTitleChange: event => {
      dispatch(fieldActions.docTitleChange(event.target.value));
    },
    onSuggestTags: event => {
      dispatch(tagActions.suggestTags(event.target.value));
    },
    onCreate: event => {
      event.preventDefault();
      dispatch(documentActions.createDocument());
    },
    onCancel: () => {
      dispatch(action.changeView('SEARCH_VIEW'));
    },
    onAddTag: tag => {
      dispatch(tagActions.addTag(tag));
    },
    onRemoveTag: tag => {
      dispatch(tagActions.removeTag(tag));
    },
    setTagIndex: index => {
      dispatch(tagActions.setTagIndex(index));
    },
    onMount: () => {
      dispatch(tagActions.getOldTags());
    },
    onAddField: field => {
      dispatch(fieldActions.addField(field));
    },
    onRemoveField: id => {
      dispatch(fieldActions.removeField(id));
    },
    onAddAttachment: event => {
      dispatch(attachmentActions.addAttachment(event.target.files));
    },
    onRemoveAttachment: id => {
      dispatch(attachmentActions.removeAttachment(id));
    },
    onPreviewAttachment: (attachment, attachmentIndex) => {
      dispatch(
        attachmentActions.previewAttachment(attachment, attachmentIndex)
      );
    },
    onDownloadAttachment: (attachment, attachmentIndex) => {
      dispatch(
        attachmentActions.downloadAttachment(attachment, attachmentIndex)
      );
    },
    onCloseSimilarDocuments: () => {
      dispatch(fieldActions.clearSimilarDocuments());
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
