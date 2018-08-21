import Bookmark from 'components/user/Bookmark';
import { deleteFavoriteDocument } from 'actions/document/document';
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {
    favoritedDocuments: state.search.get('favoritedDocuments')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPreviewDocument: documentId => {
      dispatch(documentId);
    },
    onRemoveBookmark: documentId => {
      dispatch(deleteFavoriteDocument(documentId));
    }
  };
};

const BookmarkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bookmark);

export default BookmarkContainer;
