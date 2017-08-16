const sessions = require('app/sessions');
const express = require('express');
const router = express.Router();

router.post('/', sessions.login);
router.post('/session', sessions.check);

module.exports = router;
