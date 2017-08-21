const document = require('app/document');
const express = require('express');
const router = express.Router();

router.get('/', document.search);
router.post('/', document.create);
router.get('/:id', document.get);
router.patch('/:id', document.update);
router.get('/:id/attachment/:attachmentIndex', document.getAttachment);
router.get('/check/title', document.checkTitle);

module.exports = router;
