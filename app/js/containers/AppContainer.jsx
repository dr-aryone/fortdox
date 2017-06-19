const {connect} = require('react-redux');
//const {inputChange} = require('../actions');
const App = require('../components/App');

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return dispatch;
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

module.exports = AppContainer;
