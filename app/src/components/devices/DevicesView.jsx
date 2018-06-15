const React = require('react');
// const Loader = require('components/general/Loader');
const ErrorBox = require('components/general/ErrorBox');
const LoaderOverlay = require('components/general/LoaderOverlay');
const MessageBox = require('components/general/MessageBox');
const Modal = require('components/general/Modal');

module.exports = class DevicesView extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      showModal: false
    };
  }

  componentWillReceiveProps({ QRCode } = this.props) {
    if (QRCode) this.openModal();
  }

  componentDidMount() {
    const { onMount = () => {} } = this.props;
    onMount();
  }

  openModal() {
    this.setState({
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
    const { isLoading, error, msg, onGetQRCode, QRCode } = this.props;

    const modal = (
      <Modal show={this.state.showModal} onClose={this.closeModal} showClose>
        <div className='box dialog'>
          <h2>QRCode</h2>
          {QRCode ? (
            <img alt='QR code containing activation code' src={QRCode} />
          ) : null}
        </div>
      </Modal>
    );

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <MessageBox message={msg} />
          <ErrorBox errorMsg={error} />
          {modal}
          <div className='title'>
            <h1>Devices</h1>
          </div>
          <button onClick={() => onGetQRCode()}>Add device</button>
        </div>
      </div>
    );
  }
};
