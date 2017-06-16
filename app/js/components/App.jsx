const React = require('react');
const Greeting = require('../containers/Greeting');
const Login = require('../containers/Login');

const App = () => (
  <div>
    <Greeting />
    <Login />
  </div>
);

module.exports = App;
