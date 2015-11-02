'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams', '$facebook',
            function($rootScope, $state, $stateParams, $facebook) {
            
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                // If we've already installed the SDK, we're done
                if (document.getElementById('facebook-jssdk')) {
                    return;
                }

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
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                    .otherwise('/app/signin');
                 $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '/static/templates/app.html'
                    })
                    .state('app.dashboard', {
                        url: '/dashboard/:pageId',
                        templateUrl: '/static/templates/app_dashboard.html',
                        controller: ['$scope', '$stateParams', '$rootScope', '$http', '$state', '$facebook', '$location', '$cacheFactory', function($scope, $stateParams, $rootScope, $http, $state, $facebook, $location, $cacheFactory) {
                            
                        }],
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/controllers/chart.js']);
                                }
                            ]
                        }
                    })
                    .state('app.mail', {
                      abstract: true,
                      url: '/mail',
                      templateUrl: 'static/templates/mail.html',
                      // use resolve to load other dependences
                      resolve: {
                          deps: ['ocLazyLoad',
                            function( $ocLazyLoad ){
                              return $ocLazyLoad.load( ['static/js/app/mail/mail.js',
                                                   'static/js/app/mail/mail-service.js',
                                                   'vendor/libs/moment.min.js'] );
                          }]
                      }
                    })
                    .state('app.ui', {
                      url: '/ui',
                      template: '<div ui-view class="fade-in-up"></div>'
                    })
                    .state('app.form', {
                        url: '/form',
                        template: '<div ui-view class="fade-in"></div>',
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad){
                                  return $ocLazyLoad.load('static/js/controllers/form.js');
                                }
                            ]
                        }
                    })
                    state('app.form.elements', {
                        url: '/elements',
                        templateUrl: '/static/templates/form_elements.html'
                    })
                    .state('app.form.validation', {
                        url: '/validation',
                        templateUrl: '/static/templates/form_validation.html'
                    })
                    .state('app.form.wizard', {
                        url: '/wizard',
                        templateUrl: '/static/templates/form_wizard.html'
                    })
                    .state('app.form.validation', {
                        url: '/validation',
                        templateUrl: '/static/templates/form_validation.html'
                    })
                    .state('app.form.wizard', {
                        url: '/wizard',
                        templateUrl: '/static/templates/form_wizard.html'
                    })
                    .state('app.chart', {
                        url: '/chart',
                        templateUrl: '/static/templates/ui_chart.html',
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('static/js/controllers/chart.js');
                            }]
                        }
                    })
            }



                       

                    /*
                    .state('app.page', {
                        url: '/page/:pageId',
                        templateUrl: '/static/templates/page.html',
                        controller: ['$scope', '$stateParams', '$rootScope', '$http', '$state', '$facebook', '$location', '$cacheFactory', 
                            function($scope, $stateParams, $rootScope, $http, $state, $facebook, $location, $cacheFactory) {
                                $scope.pageId = $stateParams.pageId;
                                $http({
                                    method: 'GET',
                                    url: '/page/:pageId',
                                    cache: true
                                })
                                var cache = $cacheFactory.get('$http');
                                var pageCache = cache.get("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token");
                                if (pageCache !== undefined) {
                                    $scope.pageData = pageCache;
                                }
                                $facebook.api("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token").then(
                                    function(response) {

                                        cache.put("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token", response);
                                        $scope.pageData = response;
                                        $scope.pageData.cover.source = $scope.pageData.cover.source.replace(/\/[a-z][0-9]+x[0-9]+/, "");

                                        var next = response.feed.paging.next;

                                        var promotable_posts = $scope.pageData.promotable_posts.data;

                                        for (var i = 0; i < response.feed.data.length; i++) {
                                            if (response.feed.data[i].status_type == "wall_post") {
                                                response.feed.data[i]["is_published"] = true;
                                                $scope.pageData.promotable_posts.data.push(response.feed.data[i]);
                                                console.log($scope.pageData.promotable_posts.data);
                                            }
                                        }

                                        function compare(a, b) {
                                            if (a.created_time <= b.created_time) {
                                                return 1;
                                            } else {
                                                return -1;
                                            }
                                            return 0;
                                        }

                                        $scope.pageData.promotable_posts.data.sort(compare);

                                        for (var index = 0; index < promotable_posts.length; ++index) {

                                            var promotable_post = promotable_posts[index];



                                            var insightCache = cache.get("/" + promotable_post.id + "/insights/post_impressions");

            
                                            $facebook.api("/" + promotable_post.id + "/insights/post_impressions").then(

                                                function(response) {
                                                    var id = response.data[0].id.match(/[0-9]+_[0-9]+/);

                                                    for (var i = 0; i < $scope.pageData.promotable_posts.data.length; ++i) {
                                                        if ($scope.pageData.promotable_posts.data[i].id == id) {
                                                            $scope.pageData.promotable_posts.data[i]["impression"] = response.data[0];
                                                        }
                                                    }
                                                    cache.put("/" + promotable_post.id + "/insights/post_impressions", response.data[0]);
                                                },
                                                function(err) {
                                                });
                                        }
                                    },
                                    function(err) {
                                    }
                                )
                                $scope.post1 = function() {

                                    $facebook.api('/' + $scope.pageId + '/feed?access_token=' + $scope.pageData.access_token, 'POST', {
                                        message: $scope.message,
                                        published: $scope.isPublished
                                    }).then(
                                        function(response) {
                                            $scope.message = null;
                                            location.reload();
                                        },
                                        function(err) {
                                            console.log(err);
                                        });
                                };
                                $scope.post = function() {
                                    $facebook.ui(
                                    {
                                        method: 'feed',
                                        name: 'This is the content of the "name" field.',
                                        caption: "haha",
                                        description: 'This is the content of the "description" field, below the caption.',
                                        message: '',
                                        from: $scope.pageId
                                    }, function(response){                          
                                    });
                                };
                            }
                        }]
                    })
                    */


                    .state('app.table', {
                      url: '/table',
                      template: '<div ui-view></div>'
                    })
                    .state('app.table.static', {
                      url: '/static',
                      templateUrl: 'tpl/table_static.html'
                    })
                    .state('app.table.datatable', {
                      url: '/datatable',
                      templateUrl: 'tpl/table_datatable.html'
                    })
                    .state('app.table.footable', {
                      url: '/footable',
                      templateUrl: 'tpl/table_footable.html'
                    })
                    .state('app.table.grid', {
                      url: '/grid',
                      templateUrl: 'tpl/table_grid.html',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function( $ocLazyLoad ){
                              return $ocLazyLoad.load('ngGrid').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/grid.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.calendar', {
                        url: '/calendar',
                        templateUrl: '/static/templates/app_calendar.html',
                        // use resolve to load other dependences
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        ['/static/vendor/jquery/fullcalendar/fullcalendar.css',
                                            '/static/vendor/jquery/fullcalendar/theme.css',
                                            '/static/vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                            '/static/vendor/libs/moment.min.js',
                                            '/static/vendor/jquery/fullcalendar/fullcalendar.min.js',
                                            'static/js/app/calendar/calendar.js'
                                        ]
                                    ).then(
                                        function() {
                                            return $ocLazyLoad.load('ui.calendar');
                                        }
                                    )
                                }
                            ]
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
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/controllers/vectormap.js']);
                                }
                            ]
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
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/controllers/tab.js']);
                                }
                            ]
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
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/app/note/note.js',
                                        '/static/vendor/libs/moment.min.js'
                                    ]);
                                }
                            ]
                        }
                    })
                    .state('apps.contact', {
                        url: '/contact',
                        templateUrl: '/static/templates/apps_contact.html',
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/app/contact/contact.js']);
                                }
                            ]
                        }
                    })
                    .state('app.weather', {
                        url: '/weather',
                        templateUrl: '/static/templates/apps_weather.html',
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        name: 'angular-skycons',
                                        files: ['static/js/app/weather/skycons.js',
                                            'static/vendor/libs/moment.min.js',
                                            'static/js/app/weather/angular-skycons.js',
                                            'static/js/app/weather/ctrl.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                }
            }
        ]
    );