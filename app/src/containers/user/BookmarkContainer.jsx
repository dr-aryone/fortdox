import Bookmark from 'components/user/Bookmark';
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {
    favoritedDocuments: state.search.get('favoritedDocuments')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    previewDocument: documentId => {
      dispatch(documentId);
    }
  };
};

const BookmarkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookmark);

export default BookmarkContainer;
