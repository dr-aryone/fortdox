const {connect} = require('react-redux');
const VerifyUserView = require('components/invite/VerifyUserView');
const action = require('actions');
const {verifyUser, receivePrivateKey} = require('actions/invite');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    input: {
      usernameInputValue: state.verifyUser.get('usernameInputValue'),
      passwordInputValue: state.verifyUser.get('passwordInputValue'),
      retypedInputValue: state.verifyUser.get('retypedInputValue'),
      error: state.verifyUser.get('error'),
      errorMsg: state.verifyUser.get('errorMsg')
    },
    isLoading: state.login.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(receivePrivateKey());
    },
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSubmit: () => {
      dispatch(verifyUser());
    },
    toLoginView: () => {
      dispatch(action.changeView(views.LOGIN_VIEW));
    }
  };
};

const VerifyUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyUserView);

module.exports = VerifyUserContainer;
