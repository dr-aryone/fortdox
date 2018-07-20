import React, { Component } from 'react';
import requestor from '@edgeguideab/client-request';
import config from 'config.json';

class LinkDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      results: []
    };
  }

  editSearch = e => {
    console.log(e.target.value);
    this.setState({ search: e.target.value });
    this.searchForDocuments(e.target.value);
  };

  searchForDocuments = async query => {
    let result;
    try {
      result = await requestor.get(
        `${config.server}/document/?searchString=${query}`
      );
    } catch (error) {
      console.log(error);
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
    console.log(parsed);
    this.setState({
      results: parsed
    });
  };

  onClickLinkDocument = (e, id) => {
    console.log('You clicked on document with id', id);
    if (this.props.linkOnClick) {
      this.props.linkOnClick(id);
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
                  this.onClickLinkDocument(e, doc.id);
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
