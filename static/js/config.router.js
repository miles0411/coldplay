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
                    .otherwise('/app/page/179649465404172');
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

                            var today = new Date();
                            var thirtydaysAgoTime = new Date().setDate(today.getDate() - 30);
                            var thirtydaysAgo = new Date(thirtydaysAgoTime);
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1; //January is 0!
                            var yyyy = today.getFullYear();

                            if (dd < 10) {
                                dd = '0' + dd
                            }

                            if (mm < 10) {
                                mm = '0' + mm
                            }

                            today = yyyy + '-' + mm + '-' + dd;

                            var dd1 = thirtydaysAgo.getDate();
                            var mm1 = thirtydaysAgo.getMonth() + 1; //January is 0!
                            var yyyy1 = thirtydaysAgo.getFullYear();

                            if (dd1 < 10) {
                                dd1 = '0' + dd1
                            }

                            if (mm1 < 10) {
                                mm1 = '0' + mm1
                            }

                            thirtydaysAgo = yyyy1 + '-' + mm1 + '-' + dd1;

                            $scope.pageId = $stateParams.pageId;

                            $http({
                                method: 'GET',
                                url: '/dashboard/:pageId',
                                cache: true
                            });
                            var cache = $cacheFactory.get('$http');
                            console.log(cache);
                            var pageCache = cache.get("/" + $scope.pageId + "?fields=id,feed,promotable_posts,name,category,link,likes,new_like_count,insights");

                            console.log(pageCache);
                            if (pageCache !== undefined) {
                                $scope.pageData = pageCache;
                            }

                            $facebook.api("/" + $scope.pageId + "?fields=id,feed,promotable_posts,name,category,link,likes,new_like_count,insights").then(
                                function(response) {
                                    $scope.pageData = response;

                                    cache.put("/" + $scope.pageId + "?fields=id,feed,promotable_posts,name,category,link,likes,new_like_count,insights", response);

                                    $facebook.api("/" + $scope.pageId + "/insights/page_impressions/day?since=" + thirtydaysAgo + "&until=" + today).then(
                                        function(response) {


                                            var thirtydaysImpression = [];
                                            for (var i = 0; i < response.data[0].values.length; ++i) {
                                                var dailyImp = [];
                                                var str = response.data[0].values[i].end_time
                                                var date = str.substring(5, 10);
                                                dailyImp.push(i + 1);
                                                dailyImp.push(response.data[0].values[i].value);
                                                thirtydaysImpression.push(dailyImp);
                                            }

                                            //$scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];
                                            $scope.pageData.thirtydaysImpression = thirtydaysImpression;
                                        },
                                        function(err) {
                                            console.log("err");
                                        });
                                },
                                function(err) {
                                    console.log("err");
                                });
                            
                        }],
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/controllers/chart.js']);
                                }
                            ]
                        }
                    })
                    .state('app.chart', {
                        url: '/chart',
                        templateUrl: '/static/templates/ui_chart.html',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load('static/js/controllers/chart.js');
                                }
                            ]
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
                            var pageCache = cache.get("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token");

                            console.log(pageCache);
                            if (pageCache !== undefined) {
                                $scope.pageData = pageCache;

                            }

                            $facebook.api("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token").then(
                                function(response) {
                                    //console.log(response);
                                    cache.put("/" + $scope.pageId + "?fields=promotable_posts,feed,id,name,category,link,likes,cover,username,access_token", response);
                                    $scope.pageData = response;
                                    console.log($scope.pageData.access_token);
                                    $scope.pageData.cover.source = $scope.pageData.cover.source.replace(/\/[a-z][0-9]+x[0-9]+/, "");

                                    var next = response.feed.paging.next;
                                    /*
                                    $facebook.api(response.feed.paging.next).then(
                                    function(response) {
                                      console.log(response);
                                      $scope.pageData.feed.data.concat(response.data[0]);
                                      console.log($scope.pageData.feed.data);
                                      next = response.paging.next;
                                    },
                                    function(err) {
                                      console.log("err");
                                    });
                                    */

                                    var promotable_posts = $scope.pageData.promotable_posts.data;
                                    //console.log(promotable_posts);
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
                                    console.log($scope.pageData.promotable_posts.data);

                                    for (var index = 0; index < promotable_posts.length; ++index) {

                                        var promotable_post = promotable_posts[index];
                                        console.log($scope.pageData.promotable_posts.data);


                                        var insightCache = cache.get("/" + promotable_post.id + "/insights/post_impressions");

                                        /*

                                        if (insightCache !== undefined) {

                                            for (var i = 0; i < $scope.pageData.promotable_posts.data.length; ++i) {
                                                if ($scope.pageData.promotable_posts.data[i].id == promotable_post.id) {
                                                    $scope.pageData.promotable_posts.data[i]["impression"] = insightCache;
                                                }

                                            }
                                            continue;
                                        }
                                        */
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
                                                console.log("err");
                                            });
                                    }
                                },
                                function(err) {
                                    console.log("err");
                                });

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
                                    console.log(response);                              
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
                                function(uiLoad) {
                                    return uiLoad.load(['static/js/controllers/signin.js']);
                                }
                            ]
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
                            function($ocLazyLoad, uiLoad) {
                                return uiLoad.load(
                                    ['/static/vendor/jquery/fullcalendar/fullcalendar.css',
                                        '/static/vendor/jquery/fullcalendar/theme.css',
                                        '/static/vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                        '/static/vendor/libs/moment.min.js',
                                        '/static/vendor/jquery/fullcalendar/fullcalendar.min.js',
                                        'js/app/calendar/calendar.js'
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
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['static/js/controllers/vectormap.js']);
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
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['static/js/controllers/tab.js']);
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
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['js/app/note/note.js',
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
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['js/app/contact/contact.js']);
                                }
                            ]
                        }
                    })
                    .state('app.weather', {
                        url: '/weather',
                        templateUrl: '/static/templates/apps_weather.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        name: 'angular-skycons',
                                        files: ['js/app/weather/skycons.js',
                                            '/static/vendor/libs/moment.min.js',
                                            'js/app/weather/angular-skycons.js',
                                            'js/app/weather/ctrl.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
            }
        ]
    );