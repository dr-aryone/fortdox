const React = require('react');

const SearchField = ({onSearch, onChange, value}) => {
  return (
    <div className='search-field'>
      <input
        type='text'
        placeholder='Search the document...'
        autoFocus
        value={value || ''}
        onChange={onChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      onSearch();
    }
  }
};

module.exports = SearchField;
