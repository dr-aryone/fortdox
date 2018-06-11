import App from '../components/App';
const { connect } = require('react-redux');
const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    splashScreen: state.navigation.get('splashScreen')
  };
};

const mapDispatchToProps = () => {
  return {};
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
