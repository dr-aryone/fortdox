const React = require('react');
const Loader = require('components/general/Loader');

const LoginView = ({display}) => {
  return (
    <div className={`loader ${display ? 'show' : ''}`}>
      <div className='loader-inner'>
        <Loader />
      </div>
    </div>
  );
};

module.exports = LoginView;
