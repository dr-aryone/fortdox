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
      users
    } = this.props;
    const domUsers = users.map(user => (
      <div className='user' key={user}>
        <span>{user}</span>
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
