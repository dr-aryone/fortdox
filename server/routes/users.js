const users = require('app/users');
const remove = require('app/remove');
const express = require('express');
const router = express.Router();
const requireRemoveUserPermission = require('app/permissions/removeUserPermissionMiddleware');

router.get('/', users.listOrganizationMembers);
router.delete('/:email', requireRemoveUserPermission, remove.removeUser);

module.exports = router;
