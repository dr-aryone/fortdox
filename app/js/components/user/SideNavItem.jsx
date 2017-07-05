const React = require('react');

class SideNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isActive: false
    };
  }

  render() {
    let {children} = this.props;

    return (
      <li className='drop-down' onClick={this.handleClick}>
        <a>{this.props.text}</a>
        <ul className={`items ${this.state.isActive ? 'show' : ''}`}>
          {children}
        </ul>
      </li>
    );
  }

  handleClick = () => {
    this.setState({isActive: !this.state.isActive});
  }
}

module.exports = SideNavItem;
