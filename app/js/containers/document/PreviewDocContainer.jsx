const {connect} = require('react-redux');
const PreviewDoc = require('components/document/PreviewDoc');
const {tagSearch} = require('actions/search');
const {showSearchField, search, searchFieldChange} = require('actions/document/search');
const action = require('actions');
const attachmentActions = require('actions/document/attachments');

const mapStateToProps = state => {
  return {
    docFields: state.previewDocument.get('docFields'),
    error: state.previewDocument.get('error'),
    isLoading: state.previewDocument.get('isLoading'),
    searchField: state.previewDocument.get('searchField')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onEdit: () => {
      dispatch(action.changeView('UPDATE_DOC_VIEW'));
    },
    onTagSearch: tag => {
      dispatch(tagSearch(tag));
    },
    onDownloadAttachment: (attachment, attachmentIndex) => {
      dispatch(attachmentActions.downloadAttachment(attachment, attachmentIndex));
    },
    onShowSearchField: () => {
      dispatch(showSearchField());
    },
    onSearch: () => {
      dispatch(search());
    },
    onSearchFieldChange: (event) => {
      dispatch(searchFieldChange(event.target.value));
    }
  };
};

const PreviewDocContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviewDoc);

module.exports = PreviewDocContainer;
