const express = require('express');
const router = express.Router({ mergeParams: true });
const getAttachment = require('./attachment.get');
router.get('/:attachmentIndex', getAttachment);

module.exports = router;
