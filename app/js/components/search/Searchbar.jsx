const React = require('react');

module.exports = class Searchbar extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.holdingModifier = false;
  }
  handleKeyDown(event) {
    if (this.holdingModifier && event.code === 'KeyL') {
      this.inputField.focus();
    }
    if (event.key === 'Meta' || event.key === 'Control') {
      this.holdingModifier = true;
    }
  }
  handleKeyUp(event) {
    if (event.key === 'Meta' || event.key === 'Control') {
      this.holdingModifier = false;
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
  render() {
    const {
      onSearch,
      searchString,
      onChange
    } = this.props;
    return (
      <form onSubmit={onSearch} className='input-bar box'>
        <input
          name='searchString'
          type='text'
          value={searchString}
          onChange={onChange}
          placeholder='Search'
          autoFocus
          ref={e => this.inputField = e}
        />
        <button className='material-icons' onClick={onSearch} type='submit' tabIndex={-1}>
          search
        </button>
      </form>
    );
  }
};
