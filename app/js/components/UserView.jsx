const React = require('react');

const UserView = ({username, toSearchView, toFormView}) => {
  return (
    <div>
      <h1>Welcome back, {username}!</h1>
      <button onClick={toSearchView} >
        Search
      </button>
      <button onClick={toFormView} >
        Form
      </button>
    </div>
  );
};

module.exports = UserView;
