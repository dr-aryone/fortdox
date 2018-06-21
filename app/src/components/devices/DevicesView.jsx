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
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      showModal: false,
      showDialog: false
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

  openDialog(deviceId) {
    this.setState({
      showDialog: true,
      deviceToBeDeleted: deviceId
    });
  }

  closeDialog() {
    this.setState({
      showDialog: false,
      deviceToBeDeleted: null
    });
  }

  onDelete() {
    this.props.onDeleteDevice(this.state.deviceToBeDeleted);
    this.closeDialog();
  }

  editMode(deviceId, deviceName) {
    this.setState({
      deviceId,
      deviceName
    });
  }

  inputChange(e) {
    this.setState({
      deviceName: e.target.value
    });
  }

  handleKeyDown(e) {
    const enter_key = 13;
    const esc_key = 27;

    if (e.keyCode === enter_key) {
      this.props.onUpdateDeviceName(this.state.deviceId, this.state.deviceName);
      this.setState({
        deviceId: null,
        deviceName: null
      });
    }

    if (e.keyCode === esc_key) {
      this.setState({
        deviceId: null
      });
    }
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

    const dialog = (
      <Modal
        show={this.state.showDialog}
        onClose={this.closeDialog}
        showClose={false}
      >
        <div className='box dialog'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>
            Are you sure you want to delete {this.state.deviceToBeDeleted} ?
          </p>
          <div className='buttons'>
            <button
              onClick={() => this.onDelete()}
              type='button'
              className='warning'
            >
              Delete
            </button>
            <button onClick={this.closeDialog} type='button'>
              Cancel
            </button>
          </div>
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
            {this.state.deviceId === device.get('id') ? (
              <input
                autoFocus
                name={this.state.deviceId}
                onChange={this.inputChange}
                type='text'
                value={this.state.deviceName}
                onKeyDown={this.handleKeyDown}
              />
              ) : (
                <span
                  onClick={() =>
                    this.editMode(device.get('id'), device.get('name'))
                  }
                >
                  {device.get('name')}
                </span>
              )}
            <span className='icon'>
              <i
                className='material-icons'
                onClick={() => this.openDialog(device.get('id'))}
              >
                  clear
                </i>
            </span>
          </div>
          )
        : (deviceName = device.get('name'));
    });

    const displayDevices =
      deviceList.length > 0 ? (
        <div className='no-margin-top preview'>
          <div className='title small'>
            <h3>Other Devices</h3>
          </div>
          {deviceList}
        </div>
      ) : null;

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <MessageBox message={message} />
          <ErrorBox errorMsg={error} />
          {modal}
          {dialog}
          <h1>Your Registered Devices</h1>
          <div className='no-margin-top preview'>
            <div className='title small'>
              <h3>Current Device</h3>
            </div>
            <div className='device' key={deviceId}>
              <span>{deviceId}</span>
              {this.state.deviceId === deviceId ? (
                <input
                  autoFocus
                  name={this.state.deviceId}
                  onChange={this.inputChange}
                  type='text'
                  value={this.state.deviceName}
                  onKeyDown={this.handleKeyDown}
                />
              ) : (
                <span onClick={() => this.editMode(deviceId, deviceName)}>
                  {deviceName}
                </span>
              )}
              <span className='icon' />
            </div>
          </div>
          {displayDevices}
          <button onClick={() => inviteDevice()}>Add device</button>
        </div>
      </div>
    );
  }
};
