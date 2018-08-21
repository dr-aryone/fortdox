import React, { Component } from 'react';

class BookmarkItem extends Component {
  constructor(props) {
    super(props);
    this.onCloseDropdown = this.onCloseDropdown.bind(this);
    this.state = {
      showDropdown: false
    };
  }

  onCloseDropdown(e) {
    if (e.target.id === 'remove') return;
    this.setState({
      showDropdown: false
    });
    window.removeEventListener('click', this.onCloseDropdown, true);
  }

  onRemoveBookmark(id) {
    this.props.onRemoveBookmark(id);
    this.setState({
      showDropdown: false
    });
    window.removeEventListener('click', this.onCloseDropdown, true);
  }

  onRightClick() {
    this.setState({
      showDropdown: true
    });
    window.addEventListener('click', this.onCloseDropdown, true);
  }

  render() {
    const { id, title, onPreviewDocument } = this.props;
    const dropdown = (
      <div className='dropdown'>
        <div
          className='dropdown-item'
          onClick={() => this.onRemoveBookmark(id)}
          id='remove'
        >
          Remove
        </div>
      </div>
    );

    return (
      <span
        key={id}
        className='bookmark'
        onContextMenu={() => this.onRightClick()}
      >
        <span className='text' onClick={() => onPreviewDocument(id)}>
          <i className='material-icons'>star</i>
          <span className='document-title'>{title}</span>
        </span>
        {this.state.showDropdown && dropdown}
      </span>
    );
  }
}

export default BookmarkItem;
