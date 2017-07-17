const {connect} = require('react-redux');
const UpdateDocView = require('components/document/UpdateDocView');
const action = require('actions');
const {updateDocument} = require('actions/document');
const {deleteDocument} = require('actions/document');
const views = require('views.json');

const mapStateToProps = (state) => {
  return {
    docFields: state.updateDocument.get('docFields'),
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
      dispatch(action.changeView(views.SEARCH_VIEW));
    },
    onDelete: () => {
      dispatch(deleteDocument());
    }
  };
};

const UpdateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocView);

module.exports = UpdateDocContainer;
