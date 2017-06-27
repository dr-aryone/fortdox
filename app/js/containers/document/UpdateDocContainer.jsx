const {connect} = require('react-redux');
const UpdateDocView = require('components/document/UpdateDocView');
const action = require('actions');
const {updateDocument} = require('actions/document');
const {deleteDocument} = require('actions/document');
const views = require('views.json');

const mapStateToProps = (state) => {
  return {
    input: {
      titleValue: state.updateDocument.get('titleValue'),
      textValue: state.updateDocument.get('textValue')
    }
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
      dispatch(action.currentViewToDefault());
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
