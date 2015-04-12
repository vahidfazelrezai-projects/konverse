//room view controller
angular.module('konverseApp').controller("roomController", function($scope,$routeParams,DataService) {

    var content = 'file content';
    var blob = new Blob([ content ], { type : 'text/plain' });
    $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
    $scope.clicked = false;
    $scope.insideRoom = false;
    $scope.rid = $routeParams.rid;
    $scope.uid = 'none';
    $scope.username = '';
    $scope.roomUsernames = [];
    $scope.currentText = '[waiting for microphone...]';
    $scope.transcript = [];
    $scope.lastStatementId = '';
    $scope.sentimentPercent = 20;

    // Firebase for current room
    var fb = new Firebase('https://konverse.firebaseio.com/' + $scope.rid);

    // update username list whenever a member is added or removed
    fb.child('members').on('value', function(membersSnapshot) {
        $scope.roomUsernames = [];
        membersSnapshot.forEach(function(memberSnapshot) {
            $scope.roomUsernames.push(memberSnapshot.child('name').val());
        });
        if(!$scope.$$phase) {
            $scope.$apply();
        }
    });

    // update conversation transcript whenever it is changed
    fb.child('transcript').orderByChild('time').on('value', function(transcriptSnapshot) {
        $scope.transcript = [];
        transcriptSnapshot.forEach(function(statementSnapshot) {
            $scope.transcript.unshift(statementSnapshot.val());
        });
        if(!$scope.$$phase) {
            $scope.$apply()
        }
        // $scope.sentimentPercent = getSentiment();
        $scope.sentimentPercent = 60;
        playDing();
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
        playDing();
        startSpeechToText();
    }

    // start speech recognition and listen for events
    function startSpeechToText() {
        var recognition = new webkitSpeechRecognition();
        var idleTimeout;
        var sentTimeout;
        var firstIndex = 0;
        var statementSent = 0;
        var offset = 0;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onaudiostart = function(event) {
            $scope.currentText = '';
        }

        recognition.onspeechend = function(event) {
            recognition.stop();
        }

        recognition.onend = function(event) {
            $scope.currentText = "[You've been quiet... please regrant access to the microphone to talk again.]";
            recognition.start();
            statementSent = 0;
            $scope.currentText = '';
        };

        recognition.onresult = function(event) {
            statementSent -= 1;
            if (event.results[event.resultIndex].isFinal == true) {
                clearTimeout(idleTimeout);
                if (statementSent <= 0) {
                    statementSent = 3;
                    fb.child('transcript').push({'time': Firebase.ServerValue.TIMESTAMP, 'name': $scope.username, 'text': event.results[event.resultIndex][0].transcript.substring(offset)});
                    updateSentiment(event.results[event.resultIndex][0].transcript.substring(offset));
                    $scope.currentText = '';
                }
                offset = 0;
            } else {
                $scope.currentText = event.results[event.resultIndex][0].transcript.substring(offset) + '...';
                clearTimeout(idleTimeout);
                idleTimeout = setTimeout(function() {
                    if (statementSent <= 0) {
                        statementSent = 3;
                        fb.child('transcript').push({'time': Firebase.ServerValue.TIMESTAMP, 'name': $scope.username, 'text': $scope.currentText.substring(0,$scope.currentText.length-3)});
                        updateSentiment($scope.currentText.substring(0,$scope.currentText.length-3));
                        offset = $scope.currentText.length-2;
                        $scope.currentText = '';
                    }
                }, 3000);
            }
            fb.child('members').child($scope.uid).child('currentText').set($scope.currentText);
        }

        recognition.start();
    }

    $scope.clearConversation = function() {
        fb.child('transcript').remove();
        fb.child('sentiment').remove();
    }

    $scope.exportConversation = function() {
        var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "hello world.txt");
    }

    function playDing() {
        var snd = new Audio('/assets/ding.wav');
        snd.play();
    }

    function updateSentiment(newStatement) {
        var newRating;
        DataService.postData('/sentimentCalculator', {textToAnalyze: newStatement}).then(function(response) {
            newRating = response.data;
        });

        console.log(newRating);

        fb.once('value', function(sentimentSnapshot) {
            var newTotal = 0;
            var newCount = 0;
            
            if (sentimentSnapshot.child('sentiment').exists()) {
                newTotal = sentimentSnapshot.child('sentiment').total + newRating;
                newCount = sentimentSnapshot.child('sentiment').count + 1;
            } else {
                newTotal = newRating;
                newCount = 1;
            }
            
            fb.child('sentiment').set({ total: newTotal, count: newCount });
        });

    }

    function getSentiment() {
        var count = 0;
        var total = 0;

        fb.once('value', function(sentimentSnapshot) {
            if (sentimentSnapshot.child('sentiment').exists()) {
                total = sentimentSnapshot.child('sentiment').total + newRating;
                count = sentimentSnapshot.child('sentiment').count + 1;
            } else {
                total = 0.5;
                count = 1;
            }
        });

        return (1.0 * total)/(1.0 * count);
    }

});