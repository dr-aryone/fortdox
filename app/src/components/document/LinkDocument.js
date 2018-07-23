import React, { Component } from 'react';
import requestor from '@edgeguideab/client-request';
import config from 'config.json';

class LinkDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      results: [],
      maxHits: 5
    };
  }

  editSearch = e => {
    console.log(e.target.value);
    this.setState({ search: e.target.value });
    if (e.target.value === '') {
      e.target.placeholder = 'Enter a search query';
    } else {
      this.searchForDocuments(e.target.value);
    }
  };

  searchForDocuments = async query => {
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
  };

  parseResult = searchResult => {
    const parsed = searchResult.map(doc => {
      return {
        name: doc._source.title,
        id: doc._id
      };
    });
    this.setState({
      results: parsed.slice(0, this.state.maxHits - 1)
    });
  };

  onClickLinkDocument = (e, name, id) => {
    console.log('You clicked on document with id', id);
    if (this.props.linkOnClick) {
      this.props.linkOnClick(name, id);
    }
  };

  render() {
    const rows = this.state.results.map(doc => {
      return (
        <li key={doc.id}>
          <div className='search-item' id={doc.id}>
            <div className='title'>
              <p>{doc.name}</p>
              <button
                onClick={e => {
                  this.onClickLinkDocument(e, doc.name, doc.id);
                }}
              >
                Create Link
              </button>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div>
        <input
          type='text'
          placeholder='Search for document to link'
          onChange={this.editSearch}
        />
        <div className='results'>
          <ul>{rows}</ul>
        </div>
      </div>
    );
  }
}

export default LinkDocument;
