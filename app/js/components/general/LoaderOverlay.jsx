const React = require('react');
const Loader = require('components/general/Loader');

const LoginView = ({display}) => {
  //Primary color for loader, if anyone sets it to 'red', I will find you.
  return (
    <div className={`loader ${display ? 'show' : ''}`}>
      <div className='loader-inner'>
        <Loader color='#118AB2' />
      </div>
    </div>
  );
};

module.exports = LoginView;
