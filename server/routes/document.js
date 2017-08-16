const document = require('app/document');
const express = require('express');
const router = express.Router();

router.get('/', document.search);
router.post('/', document.create);
router.patch('/', document.update);
router.delete('/', document.delete);
router.get('/check/title', document.checkTitle);

module.exports = router;
