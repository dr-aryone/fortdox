import FrontPageView from '../../components/front_page/FrontPageView';
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

const FrontPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPageView);

export default FrontPageContainer;
