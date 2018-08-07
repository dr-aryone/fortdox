const INVITE_USER = 8;
const REMOVE_USER = 4;
const DELETE_DOCUMENT = 2;
const GRANT_PERMISSION = 1;
const BASE = 0;
const MAX_RANGE = 15;
const MIN_RANGE = BASE;
const names = {
  0: 'BASE',
  1: 'GRANT_PERMISSION',
  2: 'REMOVE_DOUCMENT',
  4: 'REMOVE_USER',
  8: 'INVITE_USER'
};

const getPermissionName = i => {
  return names[i];
};

module.exports = {
  INVITE_USER,
  REMOVE_USER,
  DELETE_DOCUMENT,
  GRANT_PERMISSION,
  BASE,
  MAX_RANGE,
  MIN_RANGE,
  getPermissionName,
  names
};
