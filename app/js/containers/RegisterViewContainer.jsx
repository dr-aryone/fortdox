const {connect} = require('react-redux');
const RegisterView = require('../components/RegisterView');

const RegisterViewContainer = connect(
)(RegisterView);

module.exports = RegisterViewContainer;
