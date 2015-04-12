var express = require('express');
var router = express.Router();
var path = require('path');

// controllers
var returnIndex = require('../controllers/returnIndex');
var sentimentCalculator = require('../controllers/sentimentCalculator');
var exportText = require('../controllers/exportText');

router.get('/', returnIndex);
router.post('/sentimentCalculator', sentimentCalculator);
router.get('/*.txt', exportText);
router.get('/*', returnIndex);

module.exports = router;