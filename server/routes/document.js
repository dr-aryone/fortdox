const document = require('app/document');
const express = require('express');
const { needsMasterPassword } = require('app/sessions');
const router = express.Router();

const multer = require('multer');
const upload = multer({
  dest: '/Users/david/Developer/fortdox/server/uploads'
});

router.get('/', document.search);
router.post(
  '/',
  upload.array('attachments[]'),
  needsMasterPassword,
  document.create
);
router.get('/:id', needsMasterPassword, document.get);
router.delete('/:id', needsMasterPassword, document.delete);
router.patch('/:id', needsMasterPassword, document.update);
router.get('/check/title', document.checkTitle);

//Attachment routes
const attachments = require('app/attachments');
router.use('/:id/attachment', attachments);
//router.get('/:id/attachment/:attachmentIndex', document.getAttachment);

module.exports = router;
