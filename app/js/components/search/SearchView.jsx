const React = require('react');
const SearchItem = require('./SearchItem');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

const SearchView = ({
  searchString,
  error,
  result,
  totalHits,
  isLoading,
  onChange,
  onSearch,
  onUpdate,
  paginationSearch
}) => {
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

  let pagination = [];
  if (totalHits > 10) {
    let length = Math.ceil(totalHits/10);
    let temp = [];
    for (let i = 1; i <= length; i++) {
      temp.push(<button onClick={() => paginationSearch(i)} key={i}>{i}</button>);
    }
    pagination.push(<div>{temp}</div>);
  }


  let searchLength = totalHits ? (
    <p>{totalHits} search result{totalHits == 1 ? '' : 's'} found.</p>
  ) : null;

  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <ErrorBox errorMsg={error} />
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
        {searchResult}
        {pagination}
      </div>
    </div>
  );
};

module.exports = SearchView;
