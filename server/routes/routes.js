var express = require('express');
var router = express.Router();
var path = require('path');

// controllers
var returnIndex = require('../controllers/returnIndex');

// routes
router.get('/', returnIndex);

/***** ERROR HANDLING *****/
// 404
// router.all('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../../public/views/404.html'));
// });

module.exports = router;