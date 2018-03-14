const React = require('react');
const Loader = require('components/general/Loader');
const ErrorBox = require('components/general/ErrorBox');

module.exports = class UserList extends React.Component {
  componentDidMount() {
    const {
      onMount = () => {}
    } = this.props;
    onMount();
  }

  render() {
    const {
      loading,
      error,
      users,
      onDeleteUser
    } = this.props;

    const domUsers = users.map(user => (
      <div className={`user ${user.pending ? 'pending' : ''}`} key={user.email}>
        <span className='email'>{user.email}</span>
        <span className='pending'>{user.pending ? '(Pending)' : ''}</span>
        <i className='material-icons' onClick={() => onDeleteUser(user.email)}>clear</i>
      </div>
    ));

    return (
      <div className='user-list'>
        <div className='preview'>
          <div className='title small'>
            <h1>Users in organization</h1>
          </div>
          <div className='organization-users'>
            {loading ? <Loader /> : null}
            {error ?  <ErrorBox errorMsg={error} /> : null}
            {domUsers}
          </div>
        </div>
      </div>
    );
  }
};
