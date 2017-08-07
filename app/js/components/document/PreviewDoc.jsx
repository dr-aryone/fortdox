const React = require('react');
const {fromJS} = require('immutable');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const DocumentTags = require('./form/DocumentTags');
const Attachments = require('./form/Attachments');

const PreviewDoc = ({docFields, isLoading, error, onEdit, toSearchView}) => {
  let title = docFields.getIn(['title', 'value']);
  let texts = renderTexts(docFields);
  let tags = docFields.get('tags');
  let attachments = docFields.get('attachments');

  return (
    <div className='container-fluid'>
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <ErrorBox errorMsg={error} />
        <h1>{title}</h1>
        <div className='document'>
          <div className='main-panel box'>
            <div>
              {texts}
            </div>
            <div className='buttons'>
              <button type='button' onClick={toSearchView}>Back</button>
              <button type='button' onClick={onEdit}>Edit</button>
            </div>
          </div>
          <div className='side-panel box'>
            <DocumentTags tags={fromJS(tags)} />
            <Attachments attachments={attachments} />
          </div>
        </div>
      </div>
    </div>
  );
};

function renderTexts(doc) {
  let encryptedTexts = doc.get('encryptedTexts');
  let texts = doc.get('texts');
  let size = encryptedTexts.size + texts.size;
  let textList = [];
  for (let i = 0; i < size; i++) {
    if (encryptedTexts.size === 0) {
      textList.push(<p key={i}>{texts.first().get('value')}</p>);
      texts = texts.shift();
    } else if (texts.size === 0) {
      textList.push(<p key={i}>{encryptedTexts.first().get('value')}</p>);
      encryptedTexts = encryptedTexts.shift();
    } else {
      let encryptedID = encryptedTexts.first().get('id');
      let textID = texts.first().get('id');
      if (encryptedID < textID) {
        textList.push(<p key={i}>{encryptedTexts.first().get('value')}</p>);
        encryptedTexts = encryptedTexts.shift();
      } else {
        textList.push(<p key={i}>{texts.first().get('value')}</p>);
        texts = texts.shift();
      }
    }
  }
  return textList;
}
module.exports = PreviewDoc;
