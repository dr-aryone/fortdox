const React = require('react');
const SearchItem = require('./SearchItem');

const SearchView = ({result, onUpdate, searchString, onChange, onSearch}) => {
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
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <h1>Search</h1>
        <div className='search'>
          <input
            name='searchString'
            type='text'
            value={searchString}
            onChange={onChange}
            placeholder='Search'
          />
          <a onClick={onSearch} className='btn'>Search</a>
        </div>
        <div className='row'>
          {searchResult}
        </div>
      </div>
    </div>
  );
};

module.exports = SearchView;
