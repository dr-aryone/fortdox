import React, { Component } from 'react';
import requestor from '@edgeguideab/client-request';
import config from 'config.json';

class LinkDocument extends Component {
  constructor(props) {
    super(props);
    this.editSearch = this.editSearch.bind(this);
    this.state = {
      search: '',
      results: [],
      maxHits: 5
    };
  }

  editSearch(e) {
    this.setState({ search: e.target.value });
    if (e.target.value === '') {
      e.target.placeholder = 'Enter a search query';
    } else {
      this.searchForDocuments(e.target.value);
    }
  }

  async searchForDocuments(query) {
    let result;
    try {
      result = await requestor.get(
        `${config.server}/document/?searchString=${query}`
      );
    } catch (error) {
      console.error(error);
      return;
    }
    this.parseResult(result.body.searchResult);
  }

  parseResult(searchResult) {
    const parsed = searchResult.map(doc => {
      return {
        name: doc._source.title,
        id: doc._id
      };
    });
    this.setState({
      results: parsed.slice(0, this.state.maxHits)
    });
  }

  onClickLinkDocument(e, name, id) {
    if (this.props.linkOnClick) {
      this.props.linkOnClick(name, id);
    }
  }

  onKeyPress(event) {
    if (event.which === 13) event.preventDefault();
  }

  render() {
    const rows = this.state.results.map(doc => {
      return (
        <div className='document-item' key={doc.id} id={doc.id}>
          <h3 className='document-title'>{doc.name}</h3>
          <button
            onClick={e => {
              this.onClickLinkDocument(e, doc.name, doc.id);
            }}
            type='button'
          >
            Create Link
          </button>
        </div>
      );
    });

    return (
      <div className='link-document'>
        <div>
          <h2>Search Document</h2>
          <input
            type='text'
            onChange={this.editSearch}
            onKeyPress={this.onKeyPress}
            placeholder='Search for document'
            className='input'
            autoFocus
          />
          <div className='results'>{rows}</div>
        </div>
        <button onClick={this.props.onClose} type='button'>
          Close
        </button>
      </div>
    );
  }
}

export default LinkDocument;
