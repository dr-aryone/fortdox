const React = require('react');

const SplashScreen = ({ show }) => {
  return (
    <div className={`splash-screen ${show ? '' : 'hide'}`}>
      <div className='inner'>
        <img
          alt='Splash screen'
          src={process.env.PUBLIC_URL + '/resources/logo.svg'}
        />
      </div>
    </div>
  );
};

module.exports = SplashScreen;
