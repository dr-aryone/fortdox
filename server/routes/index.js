const express = require('express');
const router = express.Router();
const register = require('./register');
const sessions = require('./sessions');
const invite = require('./invite');
const document = require('./document');
const tags = require('./tags');

router.use('/register', register);
router.use('/login', sessions);
router.use('/invite', invite);
router.use('/document', document);
router.use('/tags', tags);

module.exports = router;
