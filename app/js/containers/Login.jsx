const React = require('react');
const {connect} = require('react-redux');
const login = require('../actions');

let Login = ({dispatch}) => {
  let input;
  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(login(input.value));
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type='submit'>
          Add Todo
        </button>
      </form>
    </div>
  );
};

Login = connect()(Login);

module.exports = Login;
