const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const DocumentTags = require('./form/DocumentTags');
const Attachments = require('./form/Attachments');

const PreviewDoc = ({docFields, isLoading, error, onEdit, onTagSearch}) => {
  let title = docFields.getIn(['title', 'value']);
  let texts = renderTexts(docFields);
  let tags = docFields.get('tags') ? <DocumentTags tags={docFields.get('tags')} onTagSearch={onTagSearch} /> : null;
  let attachments = docFields.get('attachments') ?
    <Attachments attachments={docFields.get('attachments')} /> : null;
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
  let size = encryptedTexts.size + texts.size;
  let textList = [];
  let newlineRegex = /\n/;
  let counter = 0;
  for (let i = 0; i < size; i++) {
    if (encryptedTexts.size === 0) {
      let text = texts.first().get('value').split(newlineRegex);
      text.forEach((paragraph) => {
        textList.push(<p key={counter}>{paragraph}</p>);
        counter++;
      });
      texts = texts.shift();
    } else if (texts.size === 0) {
      let text = encryptedTexts.first().get('value').split(newlineRegex);
      text.forEach((paragraph) => {
        textList.push(<p key={counter}>{paragraph}</p>);
        counter++;
      });
      encryptedTexts = encryptedTexts.shift();
    } else {
      let encryptedID = encryptedTexts.first().get('id');
      let textID = texts.first().get('id');
      if (encryptedID < textID) {
        let text = encryptedTexts.first().get('value').split(newlineRegex);
        text.forEach((paragraph) => {
          textList.push(<p key={counter}>{paragraph}</p>);
          counter++;
        });
        encryptedTexts = encryptedTexts.shift();
      } else {
        let text = texts.first().get('value').split(newlineRegex);
        text.forEach((paragraph) => {
          textList.push(<p key={counter}>{paragraph}</p>);
          counter++;
        });
        texts = texts.shift();
      }
    }
  }
  return textList;
}
module.exports = PreviewDoc;
