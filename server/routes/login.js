const sessions = require('app/sessions');
const express = require('express');
const router = express.Router();
const {restrict} = require('app/sessions');

router.post('/', sessions.login);
router.get('/check', restrict, sessions.check);

module.exports = router;
