const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');
const DocumentTags = require('./DocumentTags');

const DocumentForm = ({
  onSubmit,
  docFields,
  tags,
  onChange,
  onSuggestTags,
  onAddTag,
  onRemoveTag,
  children
}) => {
  let fields = [];
  docFields.entrySeq().forEach((entry) => {
    if (entry[0] == 'title') fields.push(
      <DocumentInputField input={entry} onChange={onChange} key={entry[0]} />
    );
    else fields.push(
      <DocumentTextArea input={entry} onChange={onChange} key={entry[0]} />
    );
  });

  return (
    <form onSubmit={onSubmit} className='document'>
      <div className='main-panel box'>
        {fields}
        {children}
      </div>
      <div className='side-panel box'>
        <DocumentTags
          onChange={onSuggestTags}
          tags={tags}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      </div>
    </form>
  );
};

module.exports = DocumentForm;
