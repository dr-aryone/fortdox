const React = require('react');
const { readStorage } = require('actions/utilities/storage');
const config = require('config.json');
const MessageBox = require('components/general/MessageBox');
class LoginView extends React.Component {
  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  render() {
    let { loginAs, toRegisterView, message, warning } = this.props;

    let userList = [];
    let storage = readStorage();
    Object.entries(storage).forEach(([email, value]) => {
      Object.keys(value).forEach(organization => {
        userList.push(
          <div
            tabIndex='0'
            onKeyDown={event => {
              if (event.keyCode === 13) loginAs(email, organization, event);
            }}
            onClick={event => loginAs(email, organization, event)}
            key={email + organization}
          >
            <h2>{organization}</h2>
            <h3>{email}</h3>
          </div>
        );
      });
    });
    let concatMessage;
    if (typeof message === 'object' && message !== null) {
      concatMessage = [];
      message.entrySeq().forEach(entry => {
        entry[0] === 'bold'
          ? concatMessage.push(<b key={entry[1]}>{entry[1]}</b>)
          : concatMessage.push(entry[1]);
      });
    } else {
      concatMessage = message;
    }

    let warningMsg = warning ? (
      <div className='alert alert-warning'>
        <i className='material-icons'>warning</i>
        {warning}
      </div>
    ) : null;

    return (
      <div className='container'>
        <MessageBox message={concatMessage} />
        {warningMsg}
        <div className='logo'>
          <img src={process.env.PUBLIC_URL + '/resources/logo.png'} />
        </div>
        <h1 className='text-center'>{config.name}</h1>
        <div
          className={`box login-panel ${userList.length == 0 ? 'hide' : ''}`}
        >
          <h2>{userList.length > 0 ? 'Choose an account' : null}</h2>
          {userList}
        </div>
        <button onClick={toRegisterView} className='block'>
          Register a New Team
        </button>
      </div>
    );
  }
}

module.exports = LoginView;
