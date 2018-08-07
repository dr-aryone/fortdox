const document = require('app/document');
const express = require('express');
const { needsMasterPassword } = require('app/sessions');
const router = express.Router();
const config = require('app/config.json');
const multer = require('multer');
const upload = multer({
  dest: config.uploadPath
});
const requireDeleteDocumentPermission = require('app/permissions/deleteDocumentPermissionMiddleware');

router.get('/', document.search);
router.post(
  '/',
  upload.array('attachments[]'),
  needsMasterPassword,
  document.create
);
router.get('/:id', needsMasterPassword, document.get);
router.delete(
  '/:id',
  needsMasterPassword,
  requireDeleteDocumentPermission,
  document.delete
);
router.patch(
  '/:id',
  needsMasterPassword,
  upload.array('attachments[]'),
  document.update
);
router.get('/check/title', document.checkTitle);

//Attachment routes
const attachments = require('app/attachments');
router.use('/:id/attachment', attachments);

module.exports = router;
