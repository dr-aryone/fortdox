const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Methods',
    'OPTION,GET,PUT,POST,DELETE,PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    req.get('Access-Control-Request-Headers')
  );
  res.header('Vary', 'Origin,Access-Control-Request-Headers');
  res.header('Access-Control-Expose-Headers', 'x-fortdox-required-version');

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Content-Length', '0');
    res.end();
  } else {
    next();
  }
};

module.exports = allowCrossDomain;
