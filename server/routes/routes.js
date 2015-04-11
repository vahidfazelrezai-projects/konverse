var express = require('express');
var router = express.Router();
var path = require('path');

// controllers
var returnIndex = require('../controllers/returnIndex');

// routes
router.get('/', returnIndex);

// routes
router.get('/*', returnIndex);

module.exports = router;