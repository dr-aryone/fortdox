const users = require('app/users');
const express = require('express');
const router = express.Router();

router.get('/', users.listOrganizationMembers);

module.exports = router;
