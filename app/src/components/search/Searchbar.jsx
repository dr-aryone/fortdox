const React = require('react');

module.exports = class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.holdingModifier = false;
    this.onSearch = event => {
      event.preventDefault();
      this.props.onSearch({freshSearch: true, searchString: this.state.searchString});
    };
    this.state = {
      searchString: props.savedSearchString
    };
  }
  onChange(e) {
    this.setState({
      searchString: e.target.value
    });
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
    return (
      <form onSubmit={this.onSearch} className='input-bar box'>
        <input
          name='searchString'
          type='text'
          value={this.state.searchString}
          onChange={this.onChange}
          placeholder='Search'
          autoFocus
          ref={e => this.inputField = e}
        />
        <button className='material-icons' onClick={this.onSearch} type='submit' tabIndex={-1}>
          search
        </button>
      </form>
    );
  }
};
