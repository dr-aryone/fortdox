const React = require('react');
const SideNavItem = require('./SideNavItem');

class SideNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //let {children} = this.props;
    return (
      <div className='side-nav'>
        <ul>
          <SideNavItem text='Bleh'>
            <li>Bra jobbat Lili</li>
          </SideNavItem>
          <SideNavItem text='Något'>
            <li>Bra jobbat Lili</li>
          </SideNavItem>
        </ul>
      </div>
    );
  }

  handleClick = () => this.setState({isVisible: !this.state.isVisible});
}

module.exports = SideNav;
