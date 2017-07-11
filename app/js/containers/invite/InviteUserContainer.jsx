const {connect} = require('react-redux');
const InviteUserView = require('components/invite/InviteUserView');
const action = require('actions');
const {inviteUser} = require('actions/invite');

const mapStateToProps = state => {
  return {
    emailInputValue: state.invite.get('emailInputValue'),
    isLoading: state.invite.get('isLoading'),
    error: state.invite.get('error'),
    errorMsg: state.invite.get('errorMsg')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSend: () => {
      dispatch(inviteUser());
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteUserView);

module.exports = LoginViewContainer;
