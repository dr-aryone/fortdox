const {connect} = require('react-redux');
const PrivateKey = require('./PrivateKey');
const toastActions = require('actions/toast');
const React = require('react');

const mapStateToProps = state => {
  return {
    show: state.toast.get('show'),
    text: state.toast.get('text'),
    icon: state.toast.get('icon')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPrivateKeySave: name => {
      dispatch(toastActions.show({
        text: [
          <span key={1}>Private key successfully saved as </span>,
          <span key={2} className='highlight'>{name}</span>
        ],
        icon: 'check'
      }));
    },
    onPrivateKeySaveFailed: () => {
      dispatch(toastActions.show({
        text: 'Unable to save private key',
        icont: 'remove'
      }));
    }
  };
};

const PrivateKeyContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivateKey);

module.exports = PrivateKeyContainer;
