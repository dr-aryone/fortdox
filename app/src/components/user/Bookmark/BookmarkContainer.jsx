import Bookmark from './Bookmark';
import {
  deleteFavoriteDocument,
  previewDocument
} from 'actions/document/document';
const { connect } = require('react-redux');

const mapStateToProps = state => {
  return {
    favoritedDocuments: state.search.get('favoritedDocuments')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPreviewDocument: documentId => {
      dispatch(previewDocument(documentId));
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
