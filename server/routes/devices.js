const router = require('express').Router();
const devices = require('app/devices');
const { restrict, needsMasterPassword } = require('app/sessions');

router.get('/', restrict, devices.listDevices);
router.delete('/:deviceId', restrict, devices.deleteDevice);
router.post('/', restrict, needsMasterPassword, devices.add);
router.post('/verify', devices.verify);
router.post('/confirm', devices.confirm);
module.exports = router;
