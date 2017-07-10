const React = require('react');
const Loader = require('components/general/Loader');

const LoginView = ({display}) => {
  return (
    <div className={`loader ${display ? 'show' : ''}`}>
      <div className='loader-inner'>
        <Loader color='#FF0000' />
      </div>
    </div>
  );
};

module.exports = LoginView;
