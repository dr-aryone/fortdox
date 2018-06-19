const router = require('express').Router();
const devices = require('app/devices');
const { restrict } = require('app/sessions');

router.get('/', restrict, devices.listDevices);

module.exports = router;
