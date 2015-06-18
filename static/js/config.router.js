'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', '$facebook',
      function ($rootScope,   $state,   $stateParams, $facebook) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          
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
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/app/dashboard');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: '/static/templates/app.html'
              })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: '/static/templates/app_dashboard.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['static/js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: '/static/templates/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('static/js/controllers/chart.js');
                      }]
                  }
              })
              // pages
              .state('app.page', {
                  url: '/page/:pageId',
                  templateUrl: '/static/templates/page.html',
                  controller: ['$scope', '$stateParams', '$rootScope', '$http', '$state', '$facebook', '$location', '$cacheFactory', function($scope, $stateParams, $rootScope, $http, $state, $facebook, $location, $cacheFactory) {
                     $scope.pageId = $stateParams.pageId;
                     
                     $http({
                        method: 'GET',
                        url: '/page/:pageId',
                        cache: true
                      });
                     var cache = $cacheFactory.get('$http');
                     console.log(cache);
                     var pageCache = cache.get("/"+$scope.pageId+"?fields=promotable_posts,id,name,category,link,likes,cover,username");
                     
                     console.log(pageCache);
                     if(pageCache !== undefined) {
                        $scope.pageData = pageCache;
                        
                     }

                      $facebook.api("/"+$scope.pageId+"?fields=promotable_posts,id,name,category,link,likes,cover,username").then(
                        function(response) {
                            console.log(response);
                            cache.put("/"+$scope.pageId+"?fields=promotable_posts,id,name,category,link,likes,cover,username", reponse);
                            $scope.pageData = response;
                            $scope.pageData.cover.source = $scope.pageData.cover.source.replace(/\/[a-z][0-9]+x[0-9]+/, "");
                            var promotable_posts = $scope.pageData.promotable_posts.data;
                            //var insights = [];
                            //$scope.pageData.promotable_posts['insights'] = insights;
                           
                            $facebook.api("/"+$scope.pageId+"?fields=feed").then(
                              function(response) {
                                
                                console.log(response);
                                for(var i = 0; i < response.feed.data.length; i++) {
                                    if(response.feed.data[i].status_type == "wall_post") {
                                      $scope.pageData.promotable_posts.data.push(response.feed.data[i]);
                                    }
                                }

                                function compare(a,b) {
                                  if(a.created_time <= b.created_time) {
                                    return 1;
                                  }
                                  else{
                                    return -1;
                                  }
                                  return 0;
                                }

                                $scope.pageData.promotable_posts.data.sort(compare);

                                console.log($scope.pageData.promotable_posts.data);
                              },
                              function(err) {
                                    console.log("err");
                              });

                            

                            var count = 0;
                            for (var index = 0; index < promotable_posts.length; ++index) {
                              var promotable_post = promotable_posts[index];
                              //var impression;
                              //promotable_post.impression = "";
                              //console.log($scope.pageData.promotable_posts.data);
                              var insightCache = cache.get("/"+promotable_post.id+"/insights/post_impressions");
                              if(insightCache !== undefined) {
                                   $scope.pageData.promotable_posts.data[count]["impression"] = insightCache;
                                   continue;
                                  //$scope.pageData.promotable_posts.data[index] = promotable_post.impression;
                                  //return;
                              }
                              
                              $facebook.api("/"+promotable_post.id+"/insights/post_impressions").then(
                              
                                function(response) {
                                    loadInsight(response.data[0]);
                                    cache.put("/"+promotable_post.id+"/insights/post_impressions", response.data[0]);
                                },
                                function(err) {
                                    console.log("err");
                                });
                                
                                function loadInsight(aimpression) {
                                  //console.log(count);
                                  //promotable_post.impression = "";
                                  //promotable_post.impression = aimpression
                                  $scope.pageData.promotable_posts.data[count]["impression"] = aimpression;
                                  //console.log($scope.pageData.promotable_posts.data[count]);
                                  count++;
                                }
                            }
                        },
                        function(err) {
                            console.log("err");
                        });
                      
                      $scope.post = function() {
                        $facebook.api("/"+$scope.pageId+"/feed", 'post', 
             { 
                 message     : "It's awesome ...",
                 link        : 'http://csslight.com',
                 picture     : 'http://csslight.com/application/upload/WebsitePhoto/567-grafmiville.png',
                 name        : 'Featured of the Day',
                 from: $scope.pageId,
                 description : 'CSS Light is a showcase for web design encouragement, submitted by web designers of all over the world. We simply accept the websites with high quality and professional touch.'
         }).then(
                        function(response) {
                            console.log(response);
                            
                        },
                        function(err) {
                            console.log("err");
                        });
                    };
                 }]
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: '/static/templates/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: '/static/templates/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['static/js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: '/static/templates/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: '/static/templates/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['/static/vendor/jquery/fullcalendar/fullcalendar.css',
                              '/static/vendor/jquery/fullcalendar/theme.css',
                              '/static/vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                              '/static/vendor/libs/moment.min.js',
                              '/static/vendor/jquery/fullcalendar/fullcalendar.min.js',
                              'js/app/calendar/calendar.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: '/static/templates/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: '/static/templates/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: '/static/templates/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['static/js/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: '/static/templates/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: '/static/templates/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: '/static/templates/layout_app.html'
                      },
                      'footer': {
                          templateUrl: '/static/templates/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['static/js/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: '/static/templates/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: '/static/templates/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/note/note.js',
                                               '/static/vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: '/static/templates/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: '/static/templates/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['js/app/weather/skycons.js',
                                          '/static/vendor/libs/moment.min.js', 
                                          'js/app/weather/angular-skycons.js',
                                          'js/app/weather/ctrl.js' ] 
                              }
                          );
                      }]
                  }
              })
      }
    ]
  );