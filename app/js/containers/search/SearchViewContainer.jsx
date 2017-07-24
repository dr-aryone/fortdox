const {connect} = require('react-redux');
const SearchView = require('components/search/SearchView');
const action = require('actions');
const search = require('actions/search');

const mapStateToProps = state => {
  return {
    searchString: state.search.get('searchString'),
    error: state.search.get('error'),
    result: state.search.get('result'),
    totalHits: state.search.get('totalHits'),
    isLoading: state.search.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSearch: (event) => {
      event.preventDefault();
      dispatch(search.paginationSearch());
    },
    onUpdate: id => {
      dispatch(search.setUpdateDocument(id));
    },
    paginationSearch: index => {
      dispatch(search.paginationSearch(index));
    }
  };
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = SearchViewContainer;
