const {connect} = require('react-redux');
const LoginView = require('components/front_page/login/LoginView');
const action = require('actions');
const views = require('views.json');
const {loginAs} = require('actions/login');

const mapStateToProps = state => {
  return {
    message: state.login.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginAs: (email, organization) => {
      dispatch(loginAs(email, organization));
    },
    toUserView: () => {
      dispatch(action.changeView(views.USER_VIEW));
    },
    toRegisterView: () => {
      dispatch(action.changeView(views.REGISTER_VIEW));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
