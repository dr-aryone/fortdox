const {connect} = require('react-redux');
const CreateDocView = require('components/document/CreateDocView');
const {inputChange} = require('actions');
const {createDocument, addTag, removeTag, getOldTags, suggestTags, setTagIndex} = require('actions/document');

const mapStateToProps = state => {
  return {
    docFields: state.createDocument.get('docFields'),
    tags: state.createDocument.get('tags'),
    error: state.createDocument.get('error'),
    isLoading: state.createDocument.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(inputChange(event.target.name, event.target.value));
    },
    onSuggestTags: event => {
      dispatch(suggestTags(event.target.value));
    },
    onCreate: (event) => {
      event.preventDefault();
      dispatch(createDocument());
    },
    onAddTag: tag => {
      dispatch(addTag(tag));
    },
    onRemoveTag: tag => {
      dispatch(removeTag(tag));
    },
    setTagIndex: index => {
      dispatch(setTagIndex(index));
    },
    onMount: () => {
      dispatch(getOldTags());
    }
  };
};

const CreateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocView);

module.exports = CreateDocContainer;
