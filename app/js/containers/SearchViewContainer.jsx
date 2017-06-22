const {connect} = require('react-redux');
const SearchView = require('components/SearchView');
const action = require('actions');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    searchString: state.search.get('searchString'),
    result: {
      title: state.search.getIn(['result', 'title']),
      text: state.search.getIn(['result', 'text'])
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (e) => {
      dispatch(action.inputChange(e.target.name, e.target.value));
    },
    onSubmit: () => {
      dispatch(action.search());
    },
    toUserView: () => {
      dispatch(action.changeView(views.USER_VIEW));
    }
  };
};

const SearchViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchView);

module.exports = SearchViewContainer;
