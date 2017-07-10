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
    let onClick = this.props.onClick ? this.props.onClick : null;
    return (
      <li className={`side-nav-item ${this.state.isActive && children ? 'active' : ''}`}>
        <a onClick={onClick ? onClick : this.handleClick}>
          <i className='material-icons nav-icon'>{this.props.icon}</i>
          <span className='text'>{this.props.text}</span>
          <i className='material-icons nav-drop-down'>
            {children ? (this.state.isActive ? 'keyboard_arrow_up' : 'keyboard_arrow_down') : ''}
          </i>
        </a>
        <ul className={`drop-down ${this.state.isActive ? 'show' : 'hide'}`}>
          {children}
        </ul>
      </li>
    );
  }

  handleClick = () => {
    return this.setState({isActive: !this.state.isActive});
  }
}

module.exports = SideNavItem;
