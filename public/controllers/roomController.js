//room view controller
angular.module('konverseApp').controller("roomController", function($scope,$routeParams,DataService) {

    $scope.insideRoom = false;
    $scope.rid = $routeParams.rid;
    $scope.uid = 'none';
    $scope.username = '';
    $scope.roomUsernames = [];
    $scope.currentText = '';
    $scope.transcript = [];
    $scope.lastStatementId = '';

    // Firebase for current room
    var fb = new Firebase('https://konverse.firebaseio.com/' + $scope.rid);

    // update username list whenever a member is added or removed
    fb.child('members').on('value', function(membersSnapshot) {
        $scope.roomUsernames = [];
        membersSnapshot.forEach(function(memberSnapshot) {
            $scope.roomUsernames.push(memberSnapshot.child('name').val());
        });
        if(!$scope.$$phase) {
            $scope.$apply()
        }
    });

    // update conversation transcript whenever it is changed
    fb.child('transcript').orderByChild('time').on('value', function(transcriptSnapshot) {
        $scope.transcript = [];
        transcriptSnapshot.forEach(function(statementSnapshot) {
            $scope.transcript.push(statementSnapshot.val());
        });
        if(!$scope.$$phase) {
            $scope.$apply()
        }
    });

    // try entering room with given username, fail if username is already taken
    $scope.attemptEnterRoom = function() {
        if ($scope.username.length < 1) {
            alert("Please enter a name...");
            console.log("Please enter a name...");
        } else if ($scope.roomUsernames.indexOf($scope.username) == -1) {
            enterRoom();
        } else {
            alert("Name taken... try again!");
            console.log("Name taken... try again!");
        }
    }

    // make appropriate changes to enter room
    function enterRoom() {
        $scope.insideRoom = true;
        $scope.uid = fb.child("members").push({"name":$scope.username}).key();
        fb.child('members').child($scope.uid).onDisconnect().remove();
        startSpeechToText();
    }

    // start speech recognition and listen for events
    function startSpeechToText() {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function(event) { 
            $scope.currentText = event.results[0][0].transcript;
            fb.child('members').child($scope.uid).child('currentText').set($scope.currentText);
            fb.child('transcript').push({'time': Firebase.ServerValue.TIMESTAMP, 'name': $scope.username, 'text': $scope.currentText});
        }

        recognition.start();
    }

});