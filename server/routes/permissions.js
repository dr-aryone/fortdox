const express = require('express');
const router = express.Router();
const readUsersAndTheirPermissions = require('app/permissions/permissions.get');
const updateUserPermission = require('app/permissions/permissions.post');
const { restrict } = require('app/sessions');

router.get('/', restrict, readUsersAndTheirPermissions);
router.post('/', restrict, updateUserPermission);

module.exports = router;
