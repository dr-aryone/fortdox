const {connect} = require('react-redux');
const CreateDocView = require('components/document/CreateDocView');
const action = require('actions');
const {createDocument} = require('actions/document');

const mapStateToProps = (state) => {
  return {
    input: {
      titleValue: state.createDocument.get('titleValue'),
      textValue: state.createDocument.get('textValue')
    },
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
    }
  };
};

const CreateDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocView);

module.exports = CreateDocContainer;
