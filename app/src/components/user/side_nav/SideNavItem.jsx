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
    let onClick = this.props.onClick ? this.props.onClick : this.handleClick;
    let dropDownIcon = children ? (this.state.isActive ? 'expand_less' : 'expand_more') : '';
    return (
      <li className={`side-nav-item ${this.state.isActive && children ? 'active' : ''}`}>
        <a onClick={onClick}>
          <div>
            <i className='material-icons nav-icon'>{this.props.icon}</i>
            <span className='text'>{this.props.text}</span>
          </div>
          <i className='material-icons nav-drop-down'>{dropDownIcon}</i>
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
