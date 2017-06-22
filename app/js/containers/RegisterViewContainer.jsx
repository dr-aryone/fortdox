const {connect} = require('react-redux');
const RegisterView = require('components/RegisterView');
const action = require('actions');
const register = require('actions/register');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    register: {
      username: state.register.get('username'),
      password: state.register.get('password'),
      reTypedPassword: state.register.get('reTypedPassword'),
      errorMsg: state.register.get('errorMsg'),
      error: state.register.get('error')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (e) => {
      dispatch(action.inputChange(e.target.name, e.target.value));
    },
    onRegister: () => {
      dispatch(register());
    },
    onBack: () => {
      dispatch(action.changeView(views.LOGIN_VIEW));
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
