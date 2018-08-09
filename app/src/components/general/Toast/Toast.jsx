const React = require('react');

const Toast = ({ icon, text, show }) => {
  icon = icon ? <span className='material-icons'>{icon}</span> : null;
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <p>
        {icon}
        {text}
      </p>
    </div>
  );
};

module.exports = Toast;
