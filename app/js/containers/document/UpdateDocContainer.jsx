const {connect} = require('react-redux');
const UpdateDocView = require('components/document/UpdateDocView');
const action = require('actions');
const {updateDocument, deleteDocument, addTag, removeTag, getOldTags} = require('actions/document');

const mapStateToProps = (state) => {
  return {
    docFields: state.updateDocument.get('docFields'),
    tags: state.updateDocument.get('tags'),
    error: state.updateDocument.get('error'),
    isLoading: state.updateDocument.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onUpdate: (event) => {
      event.preventDefault();
      dispatch(updateDocument());
    },
    toSearchView: () => {
      dispatch(action.changeView('SEARCH_VIEW'));
    },
    onDelete: () => {
      dispatch(deleteDocument());
    },
    onAddTag: () => {
      dispatch(addTag());
    },
    onRemoveTag: tagIndex => {
      dispatch(removeTag(tagIndex));
    },
    onMount: () => {
      dispatch(getOldTags());
    }
  };
};

const UpdateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocView);

module.exports = UpdateDocContainer;
