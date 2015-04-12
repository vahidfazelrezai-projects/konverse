//splash view controller
angular.module('konverseApp').controller("splashController", function($scope,$location,DataService) {

    $scope.rooms = [];

    var fb = new Firebase('https://konverse.firebaseio.com/');
    fb.once('value', function(roomsSnapshot) {
        roomsSnapshot.forEach(function(roomSnapshot) {
            $scope.rooms.push(roomSnapshot.key());
        });
        if(!$scope.$$phase) {
            $scope.$apply()
        }
    });

    $scope.test = $location.path;
    $scope.go = function(room) {
    	if (room != undefined) {
	    	$location.path("/"+room);
	    }
    }

});