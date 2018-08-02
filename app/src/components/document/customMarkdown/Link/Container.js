import Link from './Link';
import { previewDocument } from 'actions/document/document';
import { connect } from 'react-redux';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onClickDocumentLink: doc => {
      dispatch(previewDocument(doc, true));
    }
  };
};

const DocumentLinkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Link);

export { DocumentLinkContainer };
