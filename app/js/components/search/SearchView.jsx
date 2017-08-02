const React = require('react');
const SearchItem = require('./SearchItem');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const MessageBox = require('components/general/MessageBox');

const SearchView = ({
  searchString,
  currentIndex,
  error,
  message,
  result,
  totalHits,
  isLoading,
  onChange,
  onSearch,
  onUpdate,
  paginationSearch,
  toDocView
}) => {
  let searchResult = [];
  result.forEach((doc, index) => {
    searchResult.push(
      <SearchItem
        doc={doc}
        onUpdate={onUpdate}
        key={index}
      />);
  });

  let pagination = renderPagination(currentIndex, paginationSearch, totalHits);
  let searchLength = totalHits || totalHits === 0 ? (
    <p>{totalHits} search result{totalHits == 1 ? '' : 's'} found.</p>
  ) : null;

  return (
    <div className='container-fluid'>
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <ErrorBox errorMsg={error} />
        <MessageBox message={message} />
        <h1 id='top'>Search</h1>
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
        <div className='doc-button'>
          <button className='round large' onClick={toDocView}>
            <i className='material-icons'>add</i>
          </button>
        </div>
      </div>
    </div>
  );
};

function renderPagination(currentIndex, paginationSearch, totalHits) {
  let pagination = [];
  if (totalHits > 10) {
    let start = currentIndex > 3 ? currentIndex - 3 : 1;
    let end = Math.ceil(totalHits/10) > start + 6 ? start + 6 : Math.ceil(totalHits/10);
    let temp = new Array(end-start+1);
    temp.fill(null);
    temp.forEach((value, i) => {
      start + i === currentIndex?
        temp.push(<button className='pagination focused' key={start+i}>{start+i}</button>):
        temp.push(<button className='pagination' onClick={() => paginationSearch(start+i)} key={start+i}>{start+i}</button>);
    });
    if (currentIndex !== 1) temp.unshift(
      <button className='pagination' onClick={() => paginationSearch(currentIndex-1)} key='left'>
        <i className='material-icons'>keyboard_arrow_left</i>
      </button>
    );
    if (Math.ceil(totalHits/10) !== currentIndex) temp.push(
      <button className='pagination' onClick={() => paginationSearch(currentIndex+1)} key='right'>
        <i className='material-icons'>keyboard_arrow_right</i>
      </button>
    );
    pagination.push(<div key={length} className='pagination'>
      {temp}
    </div>);
  }

  return pagination;
}

module.exports = SearchView;
