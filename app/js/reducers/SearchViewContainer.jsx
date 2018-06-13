const {connect} = require('react-redux');
const SearchView = require('components/search/SearchView');
const action = require('actions');
const search = require('actions/search');
const {openDocument, previewDocument} = require('actions/document');

const mapStateToProps = state => {
  return {
    savedSearchString: state.search.get('searchString'),
    currentIndex: state.search.get('currentIndex'),
    error: state.search.get('error'),
    message: state.search.get('message'),
    result: state.search.get('result'),
    totalHits: state.search.get('totalHits'),
    isLoading: state.search.get('isLoading'),
    showPreview: state.previewDocument.get('showPreview'),
    documentToUpdate: state.updateDocument.get('documentToUpdate')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSearch: args => {
      dispatch(search.search(args));
    },
    onUpdate: id => {
      dispatch(openDocument(id));
      dispatch(action.changeView('UPDATE_DOC_VIEW'));
    },
    toDocView: () => {
      dispatch(action.changeView('CREATE_DOC_VIEW'));
    },
    onPreview: id => {
      dispatch(previewDocument(id, true));
    },
    onTagSearch: tag => {
      dispatch(search.tagSearch(tag));
    }
  };
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = SearchViewContainer;
