const express = require('express');
const router = express.Router();
const register = require('./register');
const login = require('./login');
const invite = require('./invite');
const document = require('./document');
const tags = require('./tags');
const users = require('./users');
const devices = require('./devices');
const { restrict } = require('app/sessions');

router.use('/login', login);
router.use('/devices', devices);
router.use('/register', register);
router.use('/invite', invite);
router.use('/document', restrict, document);
router.use('/tags', restrict, tags);
router.use('/users', restrict, users);

module.exports = router;
