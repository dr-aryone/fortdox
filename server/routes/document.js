const document = require('app/document');
const express = require('express');
const router = express.Router();

router.get('/', document.search);
router.get('/:id', document.get);
router.post('/', document.create);
router.patch('/', document.update);
router.get('/check/title', document.checkTitle);

module.exports = router;
