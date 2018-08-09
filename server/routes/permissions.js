const express = require('express');
const router = express.Router();
const readUsersAndTheirPermissions = require('app/permissions/permissions.get');
const updateUserPermission = require('app/permissions/permissions.post');
const requiresGrantPermission = require('app/permissions/grantPermissionMiddleware');
const listPermissions = require('app/permissions/listPermissions.get');
const userPermissions = require('app/permissions/userPermissions.get');
const admin = require('app/permissions/admin.post');
const deleteAdmin = require('app/permissions/admin.delete');

router.get('/', listPermissions);
router.get('/me', userPermissions);

router.get('/users', requiresGrantPermission, readUsersAndTheirPermissions);
router.post('/users', requiresGrantPermission, updateUserPermission);

router.post('/admin', requiresGrantPermission, admin);
router.delete('/admin/:email', requiresGrantPermission, deleteAdmin);

module.exports = router;
