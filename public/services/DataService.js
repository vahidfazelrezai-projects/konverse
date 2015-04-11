angular.module('konverseApp').factory('DataService', function($http, $q){
    return {
        getData: function(path) {
            return $http.get(path)
                .then(function(response) {
                    if (typeof response.data === 'object') {
                        console.log("\tgetData response from " + path + ": " + typeof response.data);
                        return response.data;
                    } 
                    else {
                        return $q.reject(response.data);
                    }

                }, function(response) {
                    return $q.reject(response.data);
                }
            );
        },
        postData: function(path, paramsToPass) {
            return $http.post(path, { params: paramsToPass})
                .then(function(response) {
                        console.log(response.data);
                        return response.data;
                }, function(response) {
                    return $q.reject(response.data);
                }
            );
        },
    };
});
