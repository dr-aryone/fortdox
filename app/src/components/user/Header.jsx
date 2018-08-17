const React = require('react');

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      show: false,
      hasBeenClicked: false
    };
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClose, true);
  }

  onClose(event) {
    if (event.target.id === 'TOGGLE-NAV')
      this.setState({
        hasBeenClicked: true
      });

    if (event.target.id === '')
      this.setState({
        show: false
      });
    window.removeEventListener('click', this.onClose, true);
  }

  clickHandler(event, button, logout) {
    if (button === 'TOGGLE-NAV' && this.state.hasBeenClicked) {
      return this.setState({
        hasBeenClicked: false,
        show: !this.state.show
      });
    }

    if (!this.state.show) window.addEventListener('click', this.onClose, true);

    if (button && logout) return logout();

    if (button !== 'TOGGLE-NAV') {
      return this.props.changeView(button);
    }

    this.setState({ show: !this.state.show });
  }

  render() {
    let { organization, email, changeView, logout, permissions } = this.props;

    const accessControl = (
      <li
        onClick={event => this.clickHandler(event, 'ACCESS_VIEW', null)}
        id='ACCESS_VIEW'
      >
        <i className='material-icons' id='ACCESS_VIEW'>
          supervisor_account
        </i>{' '}
        Access Management
      </li>
    );

    return (
      <div className='header'>
        <div className='container'>
          <span className='navigation'>
            <i
              className='material-icons'
              onClick={() => changeView('SEARCH_VIEW')}
            >
              search
            </i>
            <i
              className='material-icons'
              onClick={() => changeView('CREATE_DOC_VIEW')}
            >
              description
            </i>
            <i
              className='material-icons'
              onClick={() => changeView('INVITE_USER_VIEW')}
            >
              person
            </i>
            <i
              className='material-icons'
              onClick={() => changeView('DEVICES_VIEW')}
            >
              devices
            </i>
          </span>
          <span className='account'>
            <span className='user'>
              <div id='organization'>{organization}</div>
              <div id='email'>{email}</div>
            </span>
            <div
              className='account-icons'
              onClick={event => this.clickHandler(event, 'TOGGLE-NAV', null)}
              id='TOGGLE-NAV'
            >
              <i className='material-icons' id='TOGGLE-NAV'>
                account_circle
              </i>
              <i className='material-icons' id='TOGGLE-NAV'>
                keyboard_arrow_down
              </i>
              <div
                className={`dropdown-wrapper ${this.state.show ? 'show' : ''}`}
              >
                <ul className={`dropdown ${this.state.show ? 'show' : ''}`}>
                  {permissions.get('ADMIN') && accessControl}
                  <li
                    onClick={event =>
                      this.clickHandler(event, 'LOGOUT', logout)
                    }
                    id='LOGOUT'
                  >
                    <i className='material-icons logout' id='LOGOUT'>
                      power_settings_new
                    </i>
                    Log out
                  </li>
                </ul>
              </div>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

module.exports = Header;
