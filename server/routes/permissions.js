const express = require('express');
const router = express.Router();
const readUsersAndTheirPermissions = require('app/permissions/permissions.get');
const updateUserPermission = require('app/permissions/permissions.post');
const { restrict } = require('app/sessions');
const requiresGrantPermission = require('app/permissions/grantPermissionMiddleware');

router.get(
  '/',
  restrict,
  requiresGrantPermission,
  readUsersAndTheirPermissions
);

router.post('/', restrict, requiresGrantPermission, updateUserPermission);

module.exports = router;
