const {connect} = require('react-redux');
const Copy = require('./Copy');
const toastActions = require('actions/toast');
const React = require('react');

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCopy: () => {
      dispatch(
        toastActions.show({
          text: [<span key={1}>Copied to clipboard</span>],
          icon: 'check'
        })
      );
    }
  };
};

const CopyContainer = connect(mapStateToProps, mapDispatchToProps)(Copy);

module.exports = CopyContainer;
