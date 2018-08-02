import React, { Component } from 'react';
const { Wrapper } = require('./styled');

class Link extends Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onClickDocumentLink(this.props.id);
  }

  render() {
    return <Wrapper onClick={() => this.onClick()}>{this.props.name}</Wrapper>;
  }
}

export default Link;
