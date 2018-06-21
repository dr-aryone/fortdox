const React = require('react');

class BottomPanel extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.onClose = this.onClose.bind(this);

    this.state = {
      show: false,
      hasBeenClicked: false
    };
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClose);
  }

  render() {
    let { onAddField } = this.props;

    return (
      <div className='bottom-panel'>
        <div>
          <button
            className='round'
            id='TOGGLE'
            type='button'
            onClick={event => this.clickHandler(event, 'TOGGLE')}
          >
            <span className='material-icons' id='TOGGLE'>
              add
            </span>
          </button>
        </div>
        <div className={`dropdown-wrapper ${this.state.show ? 'show' : ''}`}>
          <ul className={`dropdown ${this.state.show ? 'show' : ''}`}>
            <li
              onClick={() =>
                this.clickHandler(null, 'NEW_ENCRYPTED_TEXT', onAddField)
              }
            >
              <i className='material-icons'>enhanced_encryption</i>
              New Encrypted Text
            </li>
            <li onClick={() => this.clickHandler(null, 'NEW_TEXT', onAddField)}>
              <i className='material-icons'>note_add</i>
              New Text
            </li>
          </ul>
        </div>
      </div>
    );
  }

  onClose(event) {
    if (event.target.id === 'TOGGLE')
      this.setState({
        hasBeenClicked: true
      });
    this.setState({
      show: false
    });
    window.removeEventListener('click', this.onClose, true);
  }

  clickHandler(event, button, onAddField) {
    if (button === 'TOGGLE' && this.state.hasBeenClicked)
      return this.setState({
        hasBeenClicked: false
      });

    if (!this.state.show) {
      window.addEventListener('click', this.onClose, true);
    }
    if (button && onAddField) return onAddField(button);
    return this.setState({ show: !this.state.show });
  }
}

module.exports = BottomPanel;
