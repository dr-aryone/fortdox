const React = require('react');
const Loader = require('components/general/Loader');
const ErrorBox = require('components/general/ErrorBox');
const Modal = require('components/general/Modal');

module.exports = class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    const {
      onMount = () => {}
    } = this.props;
    onMount();
  }

  openModal(user) {
    this.setState({
      userToBeDeleted: user,
      showModal: true
    });
  }

  closeModal() {
    this.setState({
      showModal: false
    });
  }

  onDelete() {
    this.props.onDeleteUser(this.state.userToBeDeleted);
    this.closeModal();
  }

  render() {
    const {
      loading,
      error,
      users
    } = this.props;

    const domUsers = users.map(user => (
      <div className={`user ${user.pending ? 'pending' : ''}`} key={user.email}>
        <span className='email'>{user.email}</span>
        <span className='pending'>{user.pending ? '(Pending)' : ''}</span>
        {this.props.user !== user.email ?
          <i className='material-icons' onClick={() => this.openModal(user.email)}>clear</i>
          : null }
      </div>
    ));

    const deleteDialog =
      (<Modal show={this.state.showModal} onClose={this.closeModal} showClose={false}>
        <div className='box dialog'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>Are you sure you want to remove {this.state.userToBeDeleted} form the organization?</p>
          <div className='buttons'>
            <button onClick={() => this.onDelete()} type='button' className='warning'>Delete</button>
            <button onClick={this.closeModal} type='button'>Cancel</button>
          </div>
        </div>
      </Modal>);

    return (
      <div className='user-list'>
        {deleteDialog}
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
