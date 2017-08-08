const React = require('react');

const DocumentTags = ({tags, onAddTag, onRemoveTag, onChange, onTagSearch}) => {
  let tagList = [];
  tags.get('list').forEach((tag, i) => {
    let removeButton = onRemoveTag ?
      <button className='material-icons round small' onClick={() => onRemoveTag(i)}>clear</button> : null;
    if (onTagSearch) {
      tagList.push(
        <div className='tag' key={i} onClick={() => onTagSearch(tag)}>
          <span>{tag}</span>
          {removeButton}
        </div>
      );
    } else {
      tagList.push(
        <div className='tag' key={i}>
          <span>{tag}</span>
          {removeButton}
        </div>
      );
    }
  });
  let tagSuggestionList = [];
  tags.get('suggested').forEach((entry, i) => {
    tagSuggestionList.push(
      <div
        key={entry}
        onClick={() => onAddTag(entry)}
        tabIndex={i+1}
        onKeyDown={(event) => {
          if (event.keyCode === 13) onAddTag(entry);
        }}
      >
        {entry}
      </div>);
  });

  let inputs = onChange ? (
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
  ) : null;

  return (
    <div className='input-field'>
      <label>Tags</label>
      <div className='tags'>
        {tagList}
      </div>
      {inputs}
      <div className='tag-dropdown'>
        <div className='tag-suggestions'>
          <div className='tag-inner'>
            {tagSuggestionList}
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = DocumentTags;
