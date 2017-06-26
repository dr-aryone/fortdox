const {connect} = require('react-redux');
const UpdateDocView = require('components/UpdateDocView');
const action = require('actions');
const {updateDocument} = require('actions/form');
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
    }
  };
};

const UpdateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocView);

module.exports = UpdateDocContainer;
