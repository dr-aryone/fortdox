import React, { Component } from 'react';

class Link extends Component {
  constructor(props) {
    super(props);
  }

  onClick = e => {
    console.log(`Navigate to ${this.props.name} with id ${this.props.id}`);

    this.props.onClickDocumentLink(this.props.id);
  };
  render() {
    return (
      <span>
        <button onClick={this.onClick}> Goto Document {this.props.name}</button>
      </span>
    );
  }
}

export default Link;
