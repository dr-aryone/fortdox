const {connect} = require('react-redux');
const Toast = require('./Toast');

const mapStateToProps = state => {
  return {
    show: state.toast.get('show'),
    text: state.toast.get('text'),
    icon: state.toast.get('icon')
  };
};

const ToastContainer = connect(
  mapStateToProps,
  {}
)(Toast);

module.exports = ToastContainer;
