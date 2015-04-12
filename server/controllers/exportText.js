var path = require('path');

function exportText (req, res) {
    // repsond with index.html
    res.sendFile(path.join(__dirname, '../../public/views/export.html'));
};

module.exports = exportText;