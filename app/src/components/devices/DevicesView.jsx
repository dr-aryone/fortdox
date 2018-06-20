const React = require('react');
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
    const {
      isLoading,
      error,
      message,
      inviteDevice,
      QRCode,
      deviceId,
      devices
    } = this.props;

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

    let deviceList = [];
    let deviceName;
    devices.forEach((device, index) => {
      device.get('id') !== deviceId
        ? deviceList.push(
          <div className='device' key={index}>
            <span>{device.get('id')}</span>
            <span>{device.get('name')}</span>
            <span className='icon'>
              <i className='material-icons'>clear</i>
            </span>
          </div>
          )
        : (deviceName = device.get('name'));
    });

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <MessageBox message={message} />
          <ErrorBox errorMsg={error} />
          {modal}
          <h1>Your Registered Devices</h1>
          <div className='no-margin-top preview'>
            <div className='title small'>
              <h3>Current Device</h3>
            </div>
            <div className='device' key={deviceId}>
              <span>{deviceId}</span>
              <span>{deviceName}</span>
              <span className='icon' />
            </div>
          </div>
          <div className='no-margin-top preview'>
            <div className='title small'>
              <h3>Other Devices</h3>
            </div>
            {deviceList}
          </div>
          <button onClick={() => inviteDevice()}>Add device</button>
        </div>
      </div>
    );
  }
};
