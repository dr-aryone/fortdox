const {connect} = require('react-redux');
const VerifyUserView = require('components/invite/VerifyUserView');
const action = require('actions');
const {verifyUser, receivePrivateKey} = require('actions/invite');

const mapStateToProps = state => {
  return {
    fields: state.verifyUser.get('fields'),
    isLoading: state.verifyUser.get('isLoading'),
    privateKey: state.verifyUser.get('privateKey'),
    error: state.verifyUser.get('error')
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
    onSubmit: (event) => {
      event.preventDefault();
      dispatch(verifyUser());
    },
    toLoginView: () => {
      dispatch(action.changeView('LOGIN_VIEW'));
    }
  };
};

const VerifyUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyUserView);

module.exports = VerifyUserContainer;
