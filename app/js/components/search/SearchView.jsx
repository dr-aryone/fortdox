const React = require('react');
const SearchItem = require('./SearchItem');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const MessageBox = require('components/general/MessageBox');
const PreviewDocContainer =  require('containers/document/PreviewDocContainer');

const SearchView = ({
  searchString,
  currentIndex,
  error,
  message,
  result,
  totalHits,
  isLoading,
  documentToUpdate,
  onChange,
  onSearch,
  onUpdate,
  paginationSearch,
  toDocView,
  onPreview,
  onTagSearch
}) => {
  let searchResult = [];
  result.forEach((doc, index) => {
    searchResult.push(
      <SearchItem
        doc={doc}
        onUpdate={onUpdate}
        onPreview={onPreview}
        onTagSearch={onTagSearch}
        key={index}
      />);
  });

  if (searchResult.length % 3 === 2) searchResult.push(<div className='search-item invisible' key={'invisible'} />);
  let pagination = renderPagination(currentIndex, paginationSearch, totalHits);
  let searchLength = totalHits || totalHits === 0 ? (
    <p>{totalHits} search result{totalHits == 1 ? '' : 's'} found.</p>
  ) : null;

  let boxes = (error || message) ? (
    <div className='alert-boxes'>
      <ErrorBox errorMsg={error} />
      <MessageBox message={message} />
    </div>
  ) : null;

  let docButton = !documentToUpdate ? (
    <div className='doc-button'>
      <button className='round large material-icons' onClick={toDocView}>add</button>
    </div>
  ) : null;

  return (
    <div className='container-fluid'>
      <LoaderOverlay display={isLoading} />
      {boxes}
      <div className={`search-container ${documentToUpdate ? 'big' : 'small'}`}>
        <div className={`left ${documentToUpdate ? 'small' : 'full'}`}>
          <span id='top' />
          <form onSubmit={onSearch} className='input-bar box'>
            <input
              name='searchString'
              type='text'
              value={searchString}
              onChange={onChange}
              placeholder='Search'
              autoFocus
            />
            <button className='material-icons' onClick={onSearch} type='submit'>
              search
            </button>
          </form>
          {searchLength}
          <div className={`search-result ${documentToUpdate ? '' : 'grid'}`}>
            {searchResult}
          </div>
          {pagination}
          {docButton}
        </div>
        <div className={`right ${documentToUpdate ? 'show' : 'hide'}`}>
          <PreviewDocContainer />
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
      temp.push(<button className={`pagination ${start+i === currentIndex ? 'focused' : ''}`} key={start+i}>{start+i}</button>);
    });
    if (currentIndex !== 1) temp.unshift(
      <button className='pagination material-icons' onClick={() => paginationSearch(currentIndex-1)} key='left'>
        keyboard_arrow_left
      </button>
    );
    if (Math.ceil(totalHits/10) !== currentIndex) temp.push(
      <button className='pagination material-icons' onClick={() => paginationSearch(currentIndex+1)} key='right'>
        keyboard_arrow_right
      </button>
    );
    pagination.push(<div key={length} className='pagination'>
      {temp}
    </div>);
  }

  return pagination;
}

module.exports = SearchView;
