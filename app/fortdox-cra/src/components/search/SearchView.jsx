const React = require('react');
const SearchItem = require('./SearchItem');
const Searchbar = require('./Searchbar');
const LoaderOverlay = require('../../components/general/LoaderOverlay');
const ErrorBox = require('../../components/general/ErrorBox');
const MessageBox = require('components/general/MessageBox');
const PreviewDocContainer = require('containers/document/PreviewDocContainer');
const { HITS_PER_PAGE } = require('actions/search');

const SearchView = ({
  currentIndex,
  error,
  message,
  result,
  totalHits,
  savedSearchString,
  isLoading,
  documentToUpdate,
  showPreview,
  onSearch,
  onUpdate,
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
      />
    );
  });

  if (searchResult.length % 3 === 2)
    searchResult.push(
      <div className='search-item invisible' key='invisible' />
    );
  let pagination = renderPagination(currentIndex, onSearch, totalHits);
  let searchLength =
    totalHits || totalHits === 0 ? (
      <p>
        {totalHits} search result{totalHits == 1 ? '' : 's'} found.
      </p>
    ) : null;

  let boxes =
    error || message ? (
      <div className='alert-boxes'>
        <ErrorBox errorMsg={error} />
        <MessageBox message={message} />
      </div>
    ) : null;

  let docButton = !documentToUpdate ? (
    <div className='doc-button'>
      <button className='round large material-icons' onClick={toDocView}>
        add
      </button>
    </div>
  ) : null;

  return (
    <div className='container-fluid'>
      <LoaderOverlay display={isLoading} />
      {boxes}
      <div className={`search-container ${showPreview ? 'big' : 'small'}`}>
        <div className={`left ${showPreview ? 'small' : 'full'}`}>
          <span id='top' />
          <Searchbar
            onSearch={onSearch}
            savedSearchString={savedSearchString}
          />
          {searchLength}
          <div className={`search-result ${showPreview ? '' : 'grid'}`}>
            {searchResult}
          </div>
          {pagination}
          {docButton}
        </div>
        <div className={`right ${showPreview ? 'show' : 'hide'}`}>
          <PreviewDocContainer />
        </div>
      </div>
    </div>
  );
};

function renderPagination(currentIndex, onSearch, totalHits) {
  let pagination = [];
  if (totalHits > HITS_PER_PAGE) {
    let start = currentIndex > 3 ? currentIndex - 3 : 1;
    let end =
      Math.ceil(totalHits / HITS_PER_PAGE) > start + 6
        ? start + 6
        : Math.ceil(totalHits / HITS_PER_PAGE);
    let paginationButtons = new Array(end - start + 1);
    paginationButtons.fill(null);
    paginationButtons.forEach((value, i) => {
      paginationButtons.push(
        <button
          onClick={() => onSearch(start + i)}
          className={`pagination ${
            start + i === currentIndex ? 'focused' : ''
          }`}
          key={start + i}
        >
          {start + i}
        </button>
      );
    });
    if (currentIndex !== 1)
      paginationButtons.unshift(
        <button
          className='pagination material-icons'
          onClick={() => onSearch({ index: currentIndex - 1 })}
          key='left'
        >
          keyboard_arrow_left
        </button>
      );
    if (Math.ceil(totalHits / HITS_PER_PAGE) !== currentIndex)
      paginationButtons.push(
        <button
          className='pagination material-icons'
          onClick={() => onSearch({ index: currentIndex + 1 })}
          key='right'
        >
          keyboard_arrow_right
        </button>
      );
    pagination.push(
      <div key={pagination.length()} className='pagination'>
        {paginationButtons}
      </div>
    );
  }

  return pagination;
}

module.exports = SearchView;
