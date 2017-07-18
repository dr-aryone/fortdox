const {connect} = require('react-redux');
const VerifyLoginView = require('components/front_page/login/VerifyLoginView');
const action = require('actions');
const {login} = require('actions/login');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    organization: state.login.get('organization'),
    email: state.login.get('email'),
    input: {
      passwordInputValue: state.login.get('passwordInputValue'),
      error: state.login.get('error'),
      errorMsg: state.login.get('errorMsg')
    },
    isLoading: state.login.get('isLoading'),
    message: state.login.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onLogin: (event) => {
      event.preventDefault();
      dispatch(login());
    },
    toLoginView: () => {
      dispatch(action.changeView(views.LOGIN_VIEW));
    }
  };
};

const VerifyLoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyLoginView);

module.exports = VerifyLoginContainer;
