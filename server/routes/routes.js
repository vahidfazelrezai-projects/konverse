var express = require('express');
var router = express.Router();
var path = require('path');

// controllers
var returnIndex = require('../controllers/returnIndex');
var sentimentCalculator = require('../controllers/sentimentCalculator');

router.get('/', returnIndex);
router.post('/sentimentCalculator', sentimentCalculator);
router.get('/*', returnIndex);

module.exports = router;