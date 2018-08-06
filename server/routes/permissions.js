const express = require('express');
const router = express.Router();
const readUsersAndTheirPermissions = require('app/permissions/permissions.get');
const updateUserPermission = require('app/permissions/permissions.post');

router.get('/', readUsersAndTheirPermissions);
router.post('/', updateUserPermission);

module.exports = router;
