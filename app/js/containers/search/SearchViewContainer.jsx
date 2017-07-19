const {connect} = require('react-redux');
const SearchView = require('components/search/SearchView');
const action = require('actions');
const search = require('actions/search');

const mapStateToProps = state => {
  return {
    searchString: state.search.get('searchString'),
    error: state.search.get('error'),
    result: state.search.get('result'),
    isLoading: state.search.get('isLoading'),
    hasSearched: state.search.get('hasSearched')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSearch: (event) => {
      event.preventDefault();
      dispatch(search.search());
    },
    onUpdate: id => {
      dispatch(search.setUpdateDocument(id));
    }
  };
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = SearchViewContainer;
