const {connect} = require('react-redux');
const CreateDocView = require('components/CreateDocView');
const action = require('actions');
const {createDocument} = require('actions/form');
const views = require('views.json');

const mapStateToProps = (state) => {
  return {
    input: {
      titleValue: state.createDocument.get('titleValue'),
      textValue: state.createDocument.get('textValue')
    }
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
    toUserView: () => {
      dispatch(action.currentViewToDefault());
      dispatch(action.changeView(views.USER_VIEW));
    }
  };
};

const CreateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocView);

module.exports = CreateDocContainer;
