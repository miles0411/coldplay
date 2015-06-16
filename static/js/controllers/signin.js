'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$rootScope', '$http', '$state', '$facebook', '$location', function($scope, $rootScope, $http, $state, $facebook, $location) {

    $rootScope.isLoggedIn = false;
    $scope.login = function() {
        $facebook.login().then(function() {
          refresh();
        });
    };
    
    function refresh() {
        $facebook.api("/me").then(
        function(response) {
            $rootScope.isLoggedIn = true;
            $location.path('/app/page');
            //console.log(response);
        },
        function(err) {
            console.log("please login");
        });
    }

    refresh();
}]);