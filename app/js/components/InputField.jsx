const React = require('react');

const LoginView = ({label, type, value, onChange, name}) => {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

module.exports = LoginView;
