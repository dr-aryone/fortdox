const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const DocumentTags = require('./form/DocumentTags');
const Attachments = require('./form/Attachments');
const Remarkable = require('remarkable');
const RemarkableReactRenderer = require('remarkable-react');
const {privateKeyParser} = require('lib/remarkableExtensions');
const PrivateKey = require('./customMarkdown/PrivateKey');

let markdown = new Remarkable({
  breaks: true,
  linkify: true
});

markdown.block.ruler.before('code', 'privatekey', privateKeyParser);

markdown.renderer = new RemarkableReactRenderer({
  components: {
    privatekey: PrivateKey
  },
  tokens: {
    privatekey: 'privatekey',
  }
});

const PreviewDoc = ({docFields, isLoading, error, onEdit, onTagSearch, onDownloadAttachment}) => {
  let title = docFields.getIn(['title', 'value']);
  let texts = renderTexts(docFields);
  let tags = docFields.get('tags') ? <DocumentTags tags={docFields.get('tags')} onTagSearch={onTagSearch} /> : null;
  let attachments = docFields.get('attachments') ?
    <Attachments attachments={docFields.get('attachments')} onDownloadAttachment={onDownloadAttachment} /> : null;
  let misc = (docFields.getIn(['tags', 'list']).size || docFields.get('attachments').size) !== 0 ?
    (<div className='misc'>
      {docFields.getIn(['tags', 'list']).size > 0 ? tags : null}
      {docFields.get('attachments').size > 0 ? attachments : null}
    </div>) : null;

  return (
    <div>
      <LoaderOverlay display={isLoading} />
      <ErrorBox errorMsg={error} />
      <div className='preview'>
        <div className='title'>
          <h1>{title}</h1>
          <button onClick={onEdit}>Edit</button>
        </div>
        <div className='texts'>
          {texts}
        </div>
      </div>
      {misc}
    </div>
  );
};

function renderTexts(doc) {
  let encryptedTexts = doc.get('encryptedTexts');
  let texts = doc.get('texts');
  return encryptedTexts
    .concat(texts)
    .sort((textA, textB) => textA.get('id') < textB.get('id') ? -1 : 1)
    .map(text => (
      <div key={text.get('id')}>{markdown.render(text.get('value'))}</div>
    ));
}

module.exports = PreviewDoc;
