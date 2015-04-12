//room view controller
angular.module('konverseApp').controller("roomController", function($scope,$routeParams,DataService) {

    $scope.insideRoom = false;
    $scope.rid = $routeParams.rid;
    $scope.uid = 'none';
    $scope.username = '';
    $scope.currentText = '';
    $scope.roomUsernames = [];
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
    fb.child('transcript').on('value', function(transcriptSnapshot) {
        $scope.transcript = [];
        transcriptSnapshot.forEach(function(statementSnapshot) {
            $scope.transcript.push(statementSnapshot.val());
            console.log(statementSnapshot.val());
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
            $scope.currentText = event.results[0][0].transcript + "...";
            console.log($scope.currentText);
            if (event.results[0][0].confidence > 0.8) {
                fb.child('members').child($scope.uid).child('currentText').set($scope.currentText);
                fb.child('transcript').push({'time': Firebase.ServerValue.TIMESTAMP, 'name': $scope.username, 'text': $scope.currentText});
            }
        }
        recognition.start();
    }





    // ////// IT WORKS //////
    // // audio input
    // var recorder;
    // function startUserMedia(stream) {
    //     var input = audio_context.createMediaStreamSource(stream);
    //     console.log('Media stream created.');
    //     recorder = new Recorder(input);
    //     console.log('Recorder initialised.');
    // }
    // // init function from Recorderjs example
    // try {
    //     // webkit shim
    //     window.AudioContext = window.AudioContext || window.webkitAudioContext;
    //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    //     window.URL = window.URL || window.webkitURL;
  
    //     audio_context = new AudioContext;
    //     console.log('Audio context set up.');
    //     console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));

    // } catch (e) {
    //     alert('No web audio support in this browser!');
    // }
    // navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    //     console.log('No live audio input: ' + e);
    // });
    // ////// IT WORKS //////

    // function getBufferCallback( buffers ) {
    //     var newSource = audioContext.createBufferSource();
    //     var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
    //     newBuffer.getChannelData(0).set(buffers[0]);
    //     newBuffer.getChannelData(1).set(buffers[1]);
    //     newSource.buffer = newBuffer;

    //     newSource.connect( audioContext.destination );
    //     newSource.start(0);
    // }

});