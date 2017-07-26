const {connect} = require('react-redux');
const CreateDocView = require('components/document/CreateDocView');
const action = require('actions');
const {createDocument, addTag, removeTag, getOldTags} = require('actions/document');

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
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onCreate: (event) => {
      event.preventDefault();
      dispatch(createDocument());
    },
    onAddTag: () => {
      dispatch(addTag());
    },
    onRemoveTag: tag => {
      dispatch(removeTag(tag));
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
