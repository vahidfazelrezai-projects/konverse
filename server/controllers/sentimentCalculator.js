// var indico = require('indico.io');
// indico.apiKey = "5ad6952bd1689c50f80e36401d406c51";

function sentimentCalculator(req, res) {

    var sentiment = Math.random();
    var textToAnalyze = req.body.params.textToAnalyze;

    // console.log(textToAnalyze);
    // console.log(sentiment);

    // indico.political(textToAnalyze).then(function(result) {
    //     console.log(result);
    //     sentiment = result['Libertarian'];
    // }).catch(function(err) {
    //     console.log(err);
    // });

    res.send(sentiment);
};

module.exports = sentimentCalculator;