const users = require('app/users');
const remove = require('app/remove');
const express = require('express');
const router = express.Router();

router.get('/', users.listOrganizationMembers);
router.delete('/:email', remove.removeUser);

module.exports = router;
