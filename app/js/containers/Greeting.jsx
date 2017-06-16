const {connect} = require('react-redux');
const Title = require('../components/Title');

const mapStateToProps = state => ({
  user: state.login.user
});

const mapDispatchToProps = {};

const Greeting = connect(
  mapStateToProps,
  mapDispatchToProps
)(Title);

module.exports = Greeting;
