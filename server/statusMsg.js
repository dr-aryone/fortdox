const statusMsg = {
  '200': 'Ok',
  '401, 404': 'Username or password is incorrect.',
  '409': 'Username already exists.',
  '500': 'An error occurred. Please try again later.'
};

module.exports = statusMsg;
