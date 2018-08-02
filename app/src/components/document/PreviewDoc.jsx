import { DocumentLinkContainer as Link } from './customMarkdown/Link/Container';
import React from 'react';
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const Tags = require('./form/Tags');
const Attachments = require('./form/Attachments');
const Remarkable = require('remarkable');
const RemarkableReactRenderer = require('remarkable-react').default;
const {
  privateKeyParser,
  copyParser,
  linkParser
} = require('lib/remarkableExtensions');
const PrivateKey = require('./customMarkdown/PrivateKey');
const Copy = require('./customMarkdown/Copy');
const SearchField = require('./components/SearchField');
const { formatDate } = require('components/general/formatDate');

let markdown = new Remarkable({
  breaks: true,
  linkify: true
});

markdown.block.ruler.before('code', 'privatekey', privateKeyParser);
markdown.inline.ruler.push('copy', copyParser);
markdown.inline.ruler.push('link', linkParser);

markdown.renderer = new RemarkableReactRenderer({
  components: {
    privatekey: PrivateKey,
    copy: Copy,
    link: Link
  },
  tokens: {
    privatekey: 'privatekey',
    copy: 'copy',
    link: 'link'
  }
});

export class PreviewDoc extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.holdingModifier = false;
  }

  render() {
    let {
      docFields,
      isLoading,
      error,
      onEdit,
      onTagSearch,
      onDownloadAttachment,
      onPreviewAttachment,
      searchField,
      onSearch,
      onSearchFieldChange
    } = this.props;
    let title = docFields.getIn(['title', 'value']);
    let texts = this.renderTexts(docFields);
    let tags = docFields.get('tags') ? (
      <Tags tags={docFields.get('tags')} onTagSearch={onTagSearch} />
    ) : null;
    let attachments = docFields.get('attachments') ? (
      <Attachments
        attachments={docFields.get('attachments')}
        preview={docFields.get('preview')}
        onDownloadAttachment={onDownloadAttachment}
        onPreviewAttachment={onPreviewAttachment}
      />
    ) : null;

    let metaData = '';
    if (docFields.get('changelog')) {
      let changelog = docFields.get('changelog');
      metaData = (
        <div className='misc'>
          <div className='created'>
            <label>
              <h3>Created</h3>
            </label>
            <div className='text'>
              {formatDate(changelog.getIn([0, 'createdAt']))} by{' '}
              {changelog.getIn([0, 'user'])}
            </div>
          </div>
          <div className='edited'>
            <label>
              <h3>Last edited</h3>
            </label>
            <div className='text'>
              {formatDate(changelog.getIn([changelog.size - 1, 'createdAt']))}{' '}
              by {changelog.getIn([changelog.size - 1, 'user'])}
            </div>
          </div>
        </div>
      );
    }

    let misc =
      (docFields.getIn(['tags', 'list']).size ||
        docFields.get('attachments').size) !== 0 ? (
          <div className='misc'>
            {docFields.getIn(['tags', 'list']).size > 0 ? tags : null}
            {docFields.get('attachments').size > 0 ? attachments : null}
          </div>
      ) : null;

    return (
      <div>
        <LoaderOverlay display={isLoading} />
        <ErrorBox errorMsg={error} />
        <div className='preview margin-top'>
          {searchField.get('show') ? (
            <SearchField
              value={searchField.get('value')}
              onSearch={onSearch}
              onChange={onSearchFieldChange}
            />
          ) : null}
          <div className='title'>
            <h1>{title}</h1>
            <button onClick={onEdit}>Edit</button>
          </div>
          <div className='texts'>{texts}</div>
        </div>
        {metaData}
        {misc}
      </div>
    );
  }

  renderTexts(doc) {
    let encryptedTexts = doc
      .get('encryptedTexts')
      .map(text => text.set('encrypted', true));
    let texts = doc.get('texts');
    return encryptedTexts
      .concat(texts)
      .sort((textA, textB) => (textA.get('id') < textB.get('id') ? -1 : 1))
      .map(text => (
        <div
          className={text.get('encrypted') ? 'safe' : ''}
          key={text.get('id')}
        >
          {text.get('encrypted') ? (
            <i className='material-icons lock'>lock_outline</i>
          ) : null}
          {markdown.render(text.get('value'))}
        </div>
      ));
  }

  handleKeyDown(event) {
    if (this.holdingModifier && event.code === 'KeyF') {
      this.props.onShowSearchField();
    }
    if (event.key === 'Meta' || event.key === 'Control') {
      this.holdingModifier = true;
    }
  }

  handleKeyUp(event) {
    if (event.key === 'Meta' || event.key === 'Control') {
      this.holdingModifier = false;
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}

export default PreviewDoc;
