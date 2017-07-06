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
      <li className={`side-nav-item ${this.state.isActive ? 'active' : ''}`}>
        <a onClick={this.handleClick}>{this.props.text}</a>
        <ul className={`drop-down ${this.state.isActive ? 'show' : ''}`}>
          {children}
        </ul>
      </li>
    );
  }

  handleClick = () => {
    console.log(this.state.isActive);
    this.setState({isActive: !this.state.isActive});
  }
}

module.exports = SideNavItem;
