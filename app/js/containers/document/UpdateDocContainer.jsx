const {connect} = require('react-redux');
const UpdateDocView = require('components/document/UpdateDocView');
const action = require('actions');
const doc = require('actions/document');

const mapStateToProps = (state) => {
  return {
    docFields: state.updateDocument.get('docFields'),
    error: state.updateDocument.get('error'),
    isLoading: state.updateDocument.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event, type) => {
      dispatch(doc.docInputChange(event.target.name, event.target.value, type));
    },
    onSuggestTags: event => {
      dispatch(doc.suggestTags(event.target.value));
    },
    onUpdate: (event) => {
      event.preventDefault();
      dispatch(doc.updateDocument());
    },
    toSearchView: () => {
      dispatch(action.changeView('SEARCH_VIEW'));
    },
    onDelete: () => {
      dispatch(doc.deleteDocument());
    },
    onAddTag: tag => {
      dispatch(doc.addTag(tag));
    },
    onRemoveTag: tagIndex => {
      dispatch(doc.removeTag(tagIndex));
    },
    onMount: () => {
      dispatch(doc.getOldTags());
    },
    onAddField: field => {
      dispatch(doc.addField(field));
    },
    onRemoveField: id => {
      dispatch(doc.removeField(id));
    },
    onAddAttachment: event => {
      dispatch(doc.addAttachment(event.target.files));
    },
    onRemoveAttachment: id => {
      dispatch(doc.removeAttachment(id));
    }
  };
};

const UpdateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocView);

module.exports = UpdateDocContainer;
