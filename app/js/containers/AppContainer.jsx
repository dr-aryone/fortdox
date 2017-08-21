const {connect} = require('react-redux');
const App = require('components/App');
const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    splashScreen: state.navigation.get('splashScreen')
  };
};

const mapDispatchToProps = () => {
  return {
  };
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

module.exports = AppContainer;
