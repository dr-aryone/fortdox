const {connect} = require('react-redux');
const SearchView = require('components/search/SearchView');
const action = require('actions');
const search = require('actions/search');
const {setUpdateDocument} = require('actions/document');

const mapStateToProps = state => {
  return {
    searchString: state.search.get('searchString'),
    currentIndex: state.search.get('currentIndex'),
    error: state.search.get('error'),
    message: state.search.get('message'),
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
      dispatch(search.search());
    },
    onUpdate: id => {
      dispatch(setUpdateDocument(id));
    },
    paginationSearch: index => {
      dispatch(search.paginationSearch(index));
    },
    toDocView: () => {
      dispatch(action.changeView('CREATE_DOC_VIEW'));
    }
  };
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = SearchViewContainer;
