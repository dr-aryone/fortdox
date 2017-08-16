const invite = require('app/invite');
const express = require('express');
const router = express.Router();

router.post('/', invite.user);
router.post('/confirm', invite.confirm);
router.post('/verify', invite.verify);

module.exports = router;
