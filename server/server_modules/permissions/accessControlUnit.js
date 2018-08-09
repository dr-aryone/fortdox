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

function sanityCheck(user, permission) {
  if (typeof user !== 'number') return false;
  if (!permissionInsideRange(user)) return false;
  if (!permissionInsideRange(permission)) return false;
  return true;
}

function AccessControllUnit(user) {
  return {
    check: function(permission) {
      if (!sanityCheck(user, permission)) return false;

      if (hasPermission(user, permission)) {
        return true;
      }
      return false;
    },
    canSet: function(newPermission) {
      if (!sanityCheck(user, newPermission)) return false;

      if (!hasPermission(user, permissions.GRANT_PERMISSION)) return false;

      //Trying to grant GRANT PERMISSION
      if (hasPermission(newPermission, permissions.GRANT_PERMISSION))
        return false;

      return true;
    },
    canSetPermissionManager(newPermission) {
      if (!sanityCheck(user, newPermission)) return false;
      if (!hasPermission(user, permissions.GRANT_PERMISSION)) return false;
      return true;
    }
  };
}

module.exports = AccessControllUnit;
