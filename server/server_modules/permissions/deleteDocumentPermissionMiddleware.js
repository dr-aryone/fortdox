const permissionMiddleware = require('./permissionMiddleware');
const permissions = require('./index');

module.exports = permissionMiddleware(permissions.DELETE_DOCUMENT);
