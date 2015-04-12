var indico = require('indico.io');
indico.apiKey = "fa3a1fd14dc12e78dc09620c23da993b";

function sentimentCalculator(req, res) {

    var sentiment = .5;
    var textToAnalyze = req.body.params.textToAnalyze;

    console.log(textToAnalyze);
    console.log(sentiment);

    indico.political(textToAnalyze).then(function(result) {
        console.log(result);
        sentiment = result['Libertarian'];
    }).catch(function(err) {
        console.log(err);
    });

    res.send(sentiment);
};

module.exports = sentimentCalculator;