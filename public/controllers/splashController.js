//splash view controller
angular.module('konverseApp').controller("splashController", function($scope,$location,DataService) {
    $scope.rooms = ["hiii","room1"];
    $scope.test = $location.path;
    $scope.go = function(room) {
    	if (room != undefined) {
	    	$location.path("/"+room);
	    }
    }

});