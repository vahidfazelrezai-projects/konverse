var path = require('path');

function returnIndex (req, res) {
    // repsond with index.html
    res.sendFile(path.join(__dirname, '../../public/views/index.html'));
};

module.exports = returnIndex;