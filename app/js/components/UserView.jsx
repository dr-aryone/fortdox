const React = require('react');

const UserView = ({username}) => {
  return (
    <div>
      <h1>Welcome back, {username}!</h1>
    </div>
  );
};

module.exports = UserView;
