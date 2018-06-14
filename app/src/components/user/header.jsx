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

    this.setState({
      show: false
    });
    window.removeEventListener('click', this.onClose, true);
  }

  clickHandler = (event, button, logout) => {
    if (button === 'TOGGLE-NAV' && this.state.hasBeenClicked)
      return this.setState({
        hasBeenClicked: false
      });
    if (!this.state.show) {
      window.addEventListener('click', this.onClose, true);
    }
    if (button && logout) {
      return logout();
    }
    return this.setState({ show: !this.state.show });
  };

  render() {
    let { organization, changeView, logout } = this.props;

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
              person_add
            </i>
            <i
              className='material-icons'
              onClick={() => changeView('DEVICES_VIEW')}
            >
              devices
            </i>
          </span>
          <span className='account'>
            <span className='organization'>{organization}</span>
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
                  <li
                    onClick={event =>
                      this.clickHandler(event, 'LOGOUT', logout)
                    }
                  >
                    <i className='material-icons'>power_settings_new</i>
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
