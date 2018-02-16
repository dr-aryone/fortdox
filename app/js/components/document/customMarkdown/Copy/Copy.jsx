const React = require('react');
const clipboard = require('clipboard-js');
const Icon = require('./Icon');
const {Wrapper, ValueField, Button} = require('./styled');

module.exports = class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.onCopyClick = this.onCopyClick.bind(this);
  }

  render() {
    let {content, title: type} = this.props;

    return (
      <Wrapper>
        <ValueField>{type === 'password' ? content.replace(/./g, '•') : content}</ValueField>
        <Button onClick={this.onCopyClick}>
          <Icon />
        </Button>
      </Wrapper>
    );
  }

  async onCopyClick() {
    await clipboard.copy(this.props.content);
    this.props.onCopy();
  }
};
