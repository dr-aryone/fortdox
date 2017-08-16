const invite = require('app/invite');
const express = require('express');
const router = express.Router();
const {restrict} = require('app/sessions');

router.post('/confirm', invite.confirm);
router.post('/verify', invite.verify);
router.post('/', restrict, invite.user);

module.exports = router;
