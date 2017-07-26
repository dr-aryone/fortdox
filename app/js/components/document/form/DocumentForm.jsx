const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');

const DocumentForm = ({onSubmit, docFields, tags, onChange, onAddTag, onRemoveTag, children}) => {
  let fields = [];
  docFields.entrySeq().forEach((entry) => {
    if (entry[0] == 'title') fields.push(
      <DocumentInputField input={entry} onChange={onChange} key={entry[0]} />
    );
    else fields.push(
      <DocumentTextArea input={entry} onChange={onChange} key={entry[0]} />
    );
  });

  let tagList = [];
  tags.get('list').forEach((tag, i) => {
    tagList.push(
      <div className='tag-item' key={i}>
        <span>{tag}</span>
        <i className='material-icons' onClick={() => onRemoveTag(i)}>clear</i>
      </div>
    );
  });

  let tagSuggestionList = [];

  return (
    <form onSubmit={onSubmit} className='document'>
      <div className='main-panel box'>
        {fields}
        {children}
      </div>
      <div className='side-panel box'>
        <div className='input-field'>
          <label>Tags</label>
          <div className='tag'>
            {tagList}
          </div>
          <label>Add Tag</label>
          <input
            name='tags'
            onChange={onChange}
            value={tags.get('value')}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                event.preventDefault();
                onAddTag();
              }
            }}
          />
          <div className='tag-dropdown'>
            <div className='tag-suggestions'>
              <div className='tag-inner'>
                {tagSuggestionList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

module.exports = DocumentForm;
