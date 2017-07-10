const {connect} = require('react-redux');
const SearchView = require('components/search/SearchView');
const action = require('actions');
const search = require('actions/search');

const mapStateToProps = state => {
  return {
    searchString: state.search.get('searchString'),
    result: state.search.get('result'),
    isLoading: state.search.get('isLoading')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (e) => {
      dispatch(action.inputChange(e.target.name, e.target.value));
    },
    onSearch: () => {
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
