const React = require('react');
const Modal = require('components/general/Modal');

module.exports = class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.state = {
      showDeleteDialog: false,
      showReinviteDialog: false
    };
  }

  componentDidMount() {
    const { onMount = () => {} } = this.props;
    onMount();
  }
  componentDidUpdate() {
    if (this.props.refresh) {
      this.props.onRefresh();
    }
  }

  openDeleteDialog(user) {
    this.setState({
      userToBeDeleted: user,
      showDeleteDialog: true
    });
  }

  closeDeleteDialog() {
    this.setState({
      showDeleteDialog: false,
      userToBeDeleted: null
    });
  }

  openReinviteDialog(user) {
    this.setState({
      userToBeReinvited: user,
      showReinviteDialog: true
    });
  }

  closeReinviteDialog() {
    this.setState({
      showReinviteDialog: false,
      userToBeReinvited: null
    });
  }

  onDelete() {
    this.props.onDeleteUser(this.state.userToBeDeleted);
    this.closeDeleteDialog();
  }

  onReinvite(e) {
    this.props.onInvite(e, this.state.userToBeReinvited);
    this.closeReinviteDialog();
  }

  render() {
    const { users, permissions } = this.props;

    const domUsers = users.map(user => (
      <div className={`user ${user.pending ? 'pending' : ''}`} key={user.email}>
        <span className='email'>{user.email}</span>
        <span className='pending'>{user.pending ? '(Pending)' : ''}</span>
        {this.props.user !== user.email && (
          <span>
            <i
              className='material-icons danger'
              onClick={() => this.openDeleteDialog(user.email)}
            >
              clear
            </i>
            <i
              className='material-icons'
              onClick={() => this.openReinviteDialog(user.email)}
            >
              contact_mail
            </i>
          </span>
        )}
      </div>
    ));

    const deleteDialog = (
      <Modal
        show={this.state.showDeleteDialog}
        onClose={this.closeDeleteDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>
            Are you sure you want to remove {this.state.userToBeDeleted} form
            the organization?
          </p>
          <div className='buttons'>
            <button onClick={this.closeDeleteDialog} type='button'>
              Cancel
            </button>
            {permissions.get('REMOVE_USER') && (
              <button
                onClick={() => this.onDelete()}
                type='button'
                className='warning'
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </Modal>
    );

    const reinviteDialog = (
      <Modal
        show={this.state.showReinviteDialog}
        onClose={this.closeReinviteDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>
            Are you sure you want to reinvite {this.state.userToBeReinvited} to
            the organization?
          </p>
          <p>All devices connected to the user will be deleted.</p>
          <div className='buttons'>
            <button onClick={e => this.closeReinviteDialog(e)} type='button'>
              Cancel
            </button>
            <button onClick={e => this.onReinvite(e)} type='button'>
              Reinvite
            </button>
          </div>
        </div>
      </Modal>
    );

    return (
      <div className='user-list'>
        {deleteDialog}
        {reinviteDialog}
        <div className='preview no-margin-top'>
          <div className='title small'>
            <h1>Users in organization</h1>
          </div>
          <div className='organization-users'>{domUsers}</div>
        </div>
      </div>
    );
  }
};
