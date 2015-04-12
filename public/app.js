angular.module('konverseApp', ['ngRoute'])
//routing definitions
.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/', {
            templateUrl: '/views/splash.html',
            controller: 'splashController'
        })
        .when('/:rid', {
            templateUrl: '/views/room.html',
            controller: 'roomController'
        })
        .otherwise({
            redirectTo: '/'
        });
        //remove # from URL
        $locationProvider.html5Mode(true);
    }])

.run(function($route, $rootScope, $location, $routeParams) {
    //watch for route changes and redirect accordingly
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        $rootScope.current = next.templateUrl;
        // if ($rootScope.loginTemplates.indexOf(next.templateUrl) >= 0) {
        //     $location.path("/");
        // }
    });
})

//nav-bar.html
.directive("navbar", function() {
    return {
        restrict: 'E',
        templateUrl: '/views/navbar.html',
    };
});