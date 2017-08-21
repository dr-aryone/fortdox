const React = require('react');

const SplashScreen = ({show}) => {
  return (
    <div className={`splash-screen ${show ? '' : 'hide'}`}>
      <div className='inner'>
        <img src={window.__dirname + '/resources/logo.svg'} />
      </div>
    </div>
  );
};

module.exports = SplashScreen;
