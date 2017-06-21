const {connect} = require('react-redux');
const FormView = require('components/FormView');
const action = require('actions');

const mapStateToProps = (state) => {
  return {
    input: {
      formValue: state.form.get('formValue'),
      titleValue: state.form.get('titleValue')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSubmit: (event) => {
      event.preventDefault();
      dispatch(action.form());
    }
  };
};

const FormViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormView);

module.exports = FormViewContainer;
