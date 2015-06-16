angular.module('app', ['ngFacebook'])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('1519388198281935'); // local development: port 8080
  //$facebookProvider.setAppId('516008265213610'); // production: fb-pages-manager.appspot.com
})

.run( function( $rootScope ) {
  // Load the facebook SDK asynchronously
  (function(){
     // If we've already installed the SDK, we're done
     if (document.getElementById('facebook-jssdk')) {return;}

     // Get the first script element, which we'll use to find the parent node
     var firstScriptElement = document.getElementsByTagName('script')[0];

     // Create a new script element and set its id
     var facebookJS = document.createElement('script');
     facebookJS.id = 'facebook-jssdk';

     // Set the new script's source to the source of the Facebook JS SDK
     facebookJS.src = '//connect.facebook.net/en_US/sdk.js';

     // Insert the Facebook JS SDK into the DOM
     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
   }());
});

/*var AppCtrl = function ($scope, $facebook) {
  $scope.isLoggedIn = false;
  $scope.login = function() {
    alert("hi");
    $facebook.login().then(function() {
      refresh();
    });
  }
  function refresh() {
    $facebook.api("/me").then( 
      function(response) {
        $scope.welcomeMsg = "Welcome " + response.name;
        $scope.isLoggedIn = true;
      },
      function(err) {
        $scope.welcomeMsg = "Please log in";
      });
  }
  
  refresh();
};*/