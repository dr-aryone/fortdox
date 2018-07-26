const logger = require('app/logger');

function timer(req, res, next) {
  const path = req.path;
  const method = req.method;
  logger.info(`Incoming request ${method} ${path}`);
  const starTime = process.hrtime();
  next();
  res.on('finish', () => {
    const time = process.hrtime(starTime);
    logger.info(`Delivered in ${time[1] / 1000000.0} ms`);
  });
}

module.exports = timer;
