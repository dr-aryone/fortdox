const permissions = require('app/permissions');
function hasPermission(user, permission) {
  const result = user & permission;
  if (result === permission) {
    return true;
  }

  return false;
}

function permissionInsideRange(user) {
  if (permissions.MAX_RANGE >= user && user >= permissions.MIN_RANGE) {
    return true;
  }
  return false;
}

function AccessControllUnit(user, permission) {
  if (typeof user !== 'number') return false;
  if (!permissionInsideRange(user)) return false;

  if (hasPermission(user, permission)) {
    return true;
  }
  return false;
}

module.exports = AccessControllUnit;
