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
    this.openQRModal = this.openQRModal.bind(this);
    this.closeQRModal = this.closeQRModal.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.outsideInputClickHandler = this.outsideInputClickHandler.bind(this);
    this.closeEditMode = this.closeEditMode.bind(this);

    this.state = {
      showModal: false,
      showDialog: false,
      showQRModal: false,
      showChangeDialog: false
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

  componentWillUnmount() {
    document.removeEventListener('click', this.outsideInputClickHandler, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.QRCode !== this.props.QRCode)
      this.openQRModal(nextProps.QRCode);
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

  openQRModal(QRCode) {
    this.setState({
      showQRModal: true,
      QRCode: QRCode
    });
  }

  closeQRModal() {
    this.setState({
      showQRModal: false,
      QRCOde: null
    });
  }

  onDelete() {
    this.props.onDeleteDevice(this.state.deviceToBeDeleted);
    this.closeDialog();
  }

  editMode(deviceId, deviceName) {
    this.setState({
      deviceId,
      deviceName,
      oldDeviceName: deviceName
    });
    window.addEventListener('click', this.outsideInputClickHandler, true);
  }

  updateDeviceName() {
    this.props.onUpdateDeviceName(this.state.deviceId, this.state.deviceName);
    this.closeEditMode();
  }

  outsideInputClickHandler(e) {
    if (e.target.id === 'save')
      this.props.onUpdateDeviceName(this.state.deviceId, this.state.deviceName);
    else if (this.state.oldDeviceName !== this.state.deviceName)
      return this.setState({
        showChangeDialog: true
      });

    this.closeEditMode();
  }

  closeEditMode() {
    window.removeEventListener('click', this.outsideInputClickHandler, true);
    return this.setState({
      deviceId: null,
      deviceName: null,
      showChangeDialog: false
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
      window.removeEventListener('click', this.outsideInputClickHandler, true);
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

  onSendEmail() {
    this.props.inviteDevice();
    this.setState({
      showModal: false
    });
  }

  onGetQRCode() {
    this.props.getQRCode();
    this.setState({
      showModal: false
    });
  }

  render() {
    const {
      isLoading,
      error,
      message,
      QRCode,
      deviceId,
      devices,
      warning,
      maximumReached
    } = this.props;
    const QRCodeDialog = (
      <Modal
        show={this.state.showQRModal}
        onClose={this.closeQRModal}
        showClose
      >
        <div className='box dialog'>
          <h2>QRCode</h2>
          {QRCode ? (
            <img
              alt='QR code containing activation code'
              src={this.state.QRCode}
            />
          ) : null}
        </div>
      </Modal>
    );

    const modal = (
      <Modal show={this.state.showModal} onClose={this.closeModal}>
        <div className='big-button-container'>
          <button className='big-button' onClick={() => this.onGetQRCode()}>
            Get QR Code
          </button>
          <button className='big-button' onClick={() => this.onSendEmail()}>
            Send invitation link <i className='material-icons'>email</i>
          </button>
        </div>
      </Modal>
    );

    const deleteDeviceDialog = (
      <Modal
        show={this.state.showDialog}
        onClose={this.closeDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
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

    const inputChangeDialog = (
      <Modal
        show={this.state.showChangeDialog}
        onClose={this.closeEditMode}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Unsaved Changes</h2>
          <p>Do you want to save the new device name?</p>
          <div className='buttons'>
            <button onClick={this.closeEditMode} type='button'>
              Cancel
            </button>
            <button onClick={() => this.updateDeviceName()} type='button'>
              Save
            </button>
          </div>
        </div>
      </Modal>
    );

    let deviceList = [];
    let currentDevice;
    devices.forEach((device, index) => {
      let deviceComponent = (
        <div className='device' key={index}>
          <span className='id'>{device.get('id')}</span>
          {!device.get('activated') ? (
            <span className='name pending'>(pending)</span>
          ) : this.state.deviceId === device.get('id') ? (
            <span className='name'>
              <input
                autoFocus
                name={this.state.deviceId}
                onChange={this.inputChange}
                type='text'
                value={this.state.deviceName}
                onKeyDown={this.handleKeyDown}
              />
              <span className='material-icons' id='save'>
                check
              </span>
            </span>
          ) : (
            <span
              className='name'
              onClick={() =>
                this.editMode(device.get('id'), device.get('name'))
              }
            >
              {device.get('name')}
              <i className='material-icons'>create</i>
            </span>
          )}

          <span className='icon'>
            {device.get('id') === deviceId ? null : (
              <i
                className='material-icons'
                onClick={() => this.openDialog(device.get('id'))}
              >
                clear
              </i>
            )}
          </span>
        </div>
      );

      device.get('id') === deviceId
        ? (currentDevice = deviceComponent)
        : deviceList.push(deviceComponent);
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

    const warningBox = (
      <div className='alert alert-warning'>
        <i className='material-icons'>warning</i>
        {warning}
      </div>
    );

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <MessageBox message={message} />
          <ErrorBox errorMsg={error} />
          {warning && warningBox}
          {modal}
          {QRCodeDialog}
          {deleteDeviceDialog}
          {inputChangeDialog}
          <h1>Your Registered Devices</h1>
          <div className='no-margin-top preview'>
            <div className='title small'>
              <h3>Current Device</h3>
            </div>
            {currentDevice}
          </div>
          {displayDevices}
          <button onClick={() => this.openModal()} disabled={maximumReached}>
            {maximumReached
              ? 'Maximum number of devices reached'
              : 'Add device'}
          </button>
        </div>
      </div>
    );
  }
};
