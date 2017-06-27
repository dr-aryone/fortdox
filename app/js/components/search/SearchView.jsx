const React = require('react');
const InputField = require('components/general/InputField');
const SearchItem = require('./SearchItem');

const SearchView = ({result, onUpdate, searchString, onChange, onSearch, toUserView}) => {
  let searchResult = [];
  result.forEach((item) => {
    searchResult.push(
      <SearchItem
        title={item.getIn(['_source', 'title'])}
        text={item.getIn(['_source', 'text'])}
        key={item.get('_id')}
        onUpdate={() => onUpdate(item.get('_id'))}
      />);
  });

  return (
    <div>
      <h1>Search</h1>
      <InputField
        label='Search: '
        name='searchString'
        type='text'
        value={searchString}
        onChange={onChange}
      />
      <button onClick={toUserView}>Back</button>
      <button onClick={onSearch}>Search</button>
      {searchResult}
    </div>
  );
};

module.exports = SearchView;
