const React = require('react');
const ReactDOM = require('react-dom');

const Hello = (props) => {
  return (
    <h1>Hello world</h1>
  );
};

ReactDOM.render(<Hello text='hello world' />, document.getElementById('hello'));
