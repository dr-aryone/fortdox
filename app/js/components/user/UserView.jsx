const React = require('react');

const UserView = ({username, toSearchView, toCreateDocView}) => {
  return (
    <div>
      <h1>Welcome back, {username}!</h1>
      <button onClick={toSearchView} >
        Search
      </button>
      <button onClick={toCreateDocView} >
        Form
      </button>
    </div>
  );
};

module.exports = UserView;
