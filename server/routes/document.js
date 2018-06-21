const document = require('app/document');
const express = require('express');
const { needsMasterPassword } = require('app/sessions');
const router = express.Router();

router.get('/', document.search);
router.post('/', needsMasterPassword, document.create);
router.get('/:id', needsMasterPassword, document.get);
router.delete('/:id', needsMasterPassword, document.delete);
router.patch('/:id', needsMasterPassword, document.update);
router.get('/:id/attachment/:attachmentIndex', document.getAttachment);
router.get('/check/title', document.checkTitle);

module.exports = router;
