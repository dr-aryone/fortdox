const router = require('express').Router();
const reinvite = require('app/reinvite');

router.post('/', reinvite.reinvite);

module.exports = router;
