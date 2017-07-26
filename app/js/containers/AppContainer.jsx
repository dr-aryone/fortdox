const {connect} = require('react-redux');
const App = require('components/App');
const mapStateToProps = state => {
  return {
    view: state.navigation.get('currentView')
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
