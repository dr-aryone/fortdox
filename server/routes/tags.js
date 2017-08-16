const tags = require('app/tags');
const express = require('express');
const router = express.Router();

router.get('/', tags.get);

module.exports = router;
