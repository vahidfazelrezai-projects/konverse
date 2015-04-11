//room view controller
angular.module('konverseApp').controller("roomController", function($scope,$routeParams,DataService) {
    $scope.rid = $routeParams.rid;
    $scope.spokentext = "";

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = function(event) { 
        if (event.results[0][0].confidence > 0.8) {
            $scope.spokentext = event.results[0][0].transcript;
            spokentext.innerHTML = $scope.spokentext;
            console.log($scope.spokentext);
        }
    }
    recognition.start();
});