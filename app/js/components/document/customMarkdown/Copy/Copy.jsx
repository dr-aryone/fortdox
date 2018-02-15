const React = require('react');
const clipboard = require('clipboard-js');
const Icon = require('./Icon');
const {Wrapper, Input, Button} = require('./styled');

module.exports = class Copy extends React.Component {
  constructor(props) {
    super(props);
    this.onCopyClick = this.onCopyClick.bind(this);
  }

  render() {
    let {content, title: type} = this.props;

    return (
      <Wrapper>
        <Input disabled type={type} value={content} />
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
