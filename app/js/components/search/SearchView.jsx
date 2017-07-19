const React = require('react');
const SearchItem = require('./SearchItem');
const LoaderOverlay = require('components/general/LoaderOverlay');

const SearchView = ({result, error, onUpdate, searchString, onChange, onSearch, isLoading, hasSearched}) => {
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

  let searchLength = hasSearched ? (
    <p>{searchResult.length} search result{searchResult.length == 1 ? '' : 's'} found.</p>
  ) : null;

  let errorBox = error ? (
    <div className='alert alert-warning'>
      <i className='material-icons'>error_outline</i>
      {error}
    </div>
  ) : null;

  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        {errorBox}
        <h1>Search</h1>
        <form onSubmit={onSearch} className='input-bar box'>
          <input
            name='searchString'
            type='text'
            value={searchString}
            onChange={onChange}
            placeholder='Search'
            autoFocus
          />
          <button onClick={onSearch} type='submit'>
            <i className='material-icons'>search</i>
          </button>
        </form>
        {searchLength}
        <div className='row'>
          {searchResult}
        </div>
      </div>
    </div>
  );
};

module.exports = SearchView;
