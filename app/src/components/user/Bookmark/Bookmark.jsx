import React, { Component } from 'react';
import BookmarkItem from './BookmarkItem';

class Bookmark extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const {
      favoritedDocuments,
      onRemoveBookmark,
      onPreviewDocument
    } = this.props;

    const favorites = favoritedDocuments.map(favorite => (
      <BookmarkItem
        key={favorite.get('id')}
        id={favorite.get('id')}
        title={favorite.get('title')}
        onRemoveBookmark={onRemoveBookmark}
        onPreviewDocument={onPreviewDocument}
      />
    ));

    return favorites.size !== 0 ? (
      <div className='bookmarks'>{favorites}</div>
    ) : null;
  }
}

export default Bookmark;
