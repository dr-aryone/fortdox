const router = require('express').Router();
const devices = require('app/devices');
router.post('/', devices.add);

module.exports = router;
