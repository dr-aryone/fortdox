const router = require('express').Router();
const config = require('app/config');
const logger = require('app/logger');

router.get('/release', (req, res) => {
  logger.info('/update/release', 'Distributing latest release to', req.ip);
  res.sendFile(config.release.filename, {
    root: `${__dirname.split('/server_modules')[0]}/public/`,
    dotfiles: 'deny'
  });
});

router.get('/:version', (req, res) => {
  const version = req.params.version;
  logger.info(
    '/update',
    'Client with version',
    version,
    'is checking for updates'
  );
  if (config.clientVersion === version) {
    return res
      .status(204)
      .send()
      .end();
  }

  const update = {
    url: `${config.server}${config.release.url}`,
    name: `${config.release.name}`,
    notes: `${config.release.notes}`
  };

  res.status(200).send(update);
});

module.exports = router;
