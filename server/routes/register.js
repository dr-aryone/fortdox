const register = require('app/register');
const express = require('express');
const router = express.Router();

router.post('/', register.organization);
router.post('/confirm', register.confirm);
router.post('/verify', register.verify);

module.exports = router;
