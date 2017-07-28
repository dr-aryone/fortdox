const React = require('react');

class BottomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      show: false,
      hasBeenClosed: false
    };
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.onClose);
  }

  render () {
    let {
      onAddField
    } = this.props;

    return (
      <div className='bottom-panel'>
        <div>
          <button className='round' type='button' onClick={() => this.clickHandler('TOGGLE')}>
            <i className='material-icons'>add</i>
          </button>
        </div>
        <div className='dropdown-wrapper'>
          <ul className={`dropdown ${this.state.show ? 'show' : ''}`}>
            <li onClick={() => this.clickHandler('NEW_ENCRYPTED_TEXT', onAddField)}>
              <i className='material-icons'>enhanced_encryption</i>
              New Encrypted Text
            </li>
            <li onClick={() => this.clickHandler('NEW_TEXT', onAddField)}>
              <i className='material-icons'>note_add</i>
              New Text
            </li>
            <li onClick={() => this.clickHandler('NEW_FILE', onAddField)}>
              <i className='material-icons'>attach_file</i>
              Attach New File
            </li>
          </ul>
        </div>
      </div>
    );
  }

  onClose = () => {
    this.setState({
      show: false
    });
    window.removeEventListener('click', this.onClose, true);
  }

  clickHandler = (button, onAddField) => {
    if (!this.state.show) {
      window.addEventListener('click', this.onClose, true);
    }
    if (button && onAddField) return onAddField(button);
    return this.setState({show: !this.state.show});
  }
}

module.exports = BottomPanel;
