const express = require('express');
const router = express.Router({ mergeParams: true });
const getAttachment = require('./attachment.get');
const uploadAttachment = require('./attachment.post');

router.get('/:attachmentIndex', getAttachment);
router.post('/', uploadAttachment);

module.exports = router;
