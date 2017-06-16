const React = require('react');

const Title = ({user}) => {
  if (user === undefined) {
    return (
      <h1>Welcome</h1>
    );
  } else {
    return (
      <h1>Welcome back, {user}!</h1>
    );
  }
};

module.exports = Title;
