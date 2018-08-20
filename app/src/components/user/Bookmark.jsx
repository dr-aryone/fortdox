import React, { Component } from 'react';

class Bookmark extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    const { favoritedDocuments } = this.props;
    const favorites = favoritedDocuments.map(favorite => (
      <span key={favorite.get('id')} className='bookmark'>
        {favorite.get('title')}
      </span>
    ));
    return <div className='bookmarks'>{favorites}</div>;
  }
}

export default Bookmark;
