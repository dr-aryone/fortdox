const React = require('react');
const ReactDOM = require('react-dom');
const requestor = require('@edgeguideab/requestor');



class NameForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value:'',
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    let user = this.state.value;
    let response = await requestor.post('http://localhost:8000/user', {
      body: {msg: user}
    });
    this.setState({name: response.body.message});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Namn:
          <input type='text' value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type='submit' value='skicka' />
        <User name={this.state.name} />
      </form>
    );
  }

}

const User = ({name}) => {
  return (
    <h3>Hello, {name}</h3>
  );
};


ReactDOM.render(<NameForm />, document.getElementById('Form'));
