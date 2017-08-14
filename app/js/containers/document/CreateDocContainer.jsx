const {connect} = require('react-redux');
const CreateDocView = require('components/document/CreateDocView');
const doc = require('actions/document');

const mapStateToProps = state => {
  return {
    docFields: state.createDocument.get('docFields'),
    error: state.createDocument.get('error'),
    isLoading: state.createDocument.get('isLoading')
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
    onCreate: (event) => {
      event.preventDefault();
      dispatch(doc.createDocument());
    },
    onAddTag: tag => {
      dispatch(doc.addTag(tag));
    },
    onRemoveTag: tag => {
      dispatch(doc.removeTag(tag));
    },
    setTagIndex: index => {
      dispatch(doc.setTagIndex(index));
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

const CreateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocView);

module.exports = CreateDocContainer;
