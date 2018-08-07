const express = require('express');
const router = express.Router();
const readUsersAndTheirPermissions = require('app/permissions/permissions.get');
const updateUserPermission = require('app/permissions/permissions.post');
const requiresGrantPermission = require('app/permissions/grantPermissionMiddleware');
const listPermissions = require('app/permissions/listPermissions.get');
const userPermissions = require('app/permissions/userPermissions.get');

router.get('/', listPermissions);
router.get('/me', userPermissions);
router.get('/users/', requiresGrantPermission, readUsersAndTheirPermissions);

router.post('/', requiresGrantPermission, updateUserPermission);

module.exports = router;
