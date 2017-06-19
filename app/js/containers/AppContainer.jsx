const {connect} = require('react-redux');
//const {inputChange} = require('../actions');
const App = require('components/App');
// const LoginView = require('../components/LoginView');

const mapStateToProps = state => {
  return {view: state.navigation.get('currentView')};
};

const mapDispatchToProps = () => {
  return {};
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

module.exports = AppContainer;
