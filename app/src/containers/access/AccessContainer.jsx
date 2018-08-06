import AccessView from 'components/access/AccessView';
const { connect } = require('react-redux');

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = () => {
  return {};
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccessView);

export default SearchViewContainer;
