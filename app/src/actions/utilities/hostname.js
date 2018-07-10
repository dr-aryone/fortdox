const os = window.require('os');

const hostname = () => {
  const maybeName = os.hostname().replace('.local', '');
  return maybeName ? maybeName : 'Desktop Device';
};

module.exports = {
  hostname
};
