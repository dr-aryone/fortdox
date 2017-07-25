const {connect} = require('react-redux');
const LoginView = require('components/front_page/login/LoginView');
const action = require('actions');
const {loginAs} = require('actions/login');

const mapStateToProps = state => {
  return {
    message: state.login.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginAs: (email, organization, event) => {
      event.preventDefault();
      dispatch(loginAs(email, organization));
    },
    toUserView: () => {
      dispatch(action.changeView('USER_VIEW'));
    },
    toRegisterView: () => {
      dispatch(action.changeView('REGISTER_VIEW'));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
