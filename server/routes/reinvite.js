const router = require('express').Router();
const reinvite = require('app/reinvite');
const { needsMasterPassword } = require('app/sessions');

router.post('/', needsMasterPassword, reinvite.reinvite);

module.exports = router;
