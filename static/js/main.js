'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$rootScope', '$translate', '$localStorage', '$window', '$facebook', '$location',
    function(              $scope, $rootScope,   $translate,   $localStorage,   $window,  $facebook, $location ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      $facebook.getLoginStatus().then(
        function(response) {
            if(response.status === 'connected') {
                
                $rootScope.token = response.authResponse.accessToken;
              
                $facebook.api("me?fields=name, birthday, age_range, gender, locale, timezone, updated_time, verified, email").then(
                    function(response) {
                        console.log(response);
                        console.log(response);
                        var result = json_decode(file_get_contents(response));
                        console.log(result);
                        $scope.name = response.name;
                        $scope.uid = response.id;
                        $scope.email = response.email;
                        $scope.gender = response.gender;
                        $scope.birthday = response.birthday;
                        $scope.timezone = response.timezone;
                    },
                    function(err) {
                    });

                $location.path('/app/chart')
                  /*
                  $facebook.api("/me/accounts?limit=999&access_token="+$rootScope.token).then(
                    function(response) {
                        $scope.pages = response.data;
                        
                    },
                    function(err) {
                        console.log("please login");
                    });*/
            } else {
              $location.path('/access/signin');
            }
        },
        function(err) {
            console.log("please login");
        });
    
      // config
      $scope.app = {
        name: 'Coldplay',
        version: '1.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }
      
      $scope.logout = function () {
        $facebook.logout().then(function() {
          $location.path('/access/signin');
        });
      };

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);