const {connect} = require('react-redux');
const FormView = require('components/FormView');
const action = require('actions');
const views = require('views.json');

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
    },
    toUserView: () => {
      dispatch(action.changeView(views.USER_VIEW));
    }
  };
};

const FormViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FormView);

module.exports = FormViewContainer;
