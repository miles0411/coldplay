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
                    .otherwise('/app/chart');
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
                    .state('app.dashboard-v1', {
                      url: '/dashboard-v1',
                      templateUrl: '/static/templates/app_dashboard_v1.html',
                    })
                    .state('app.dashboard-v2', {
                      url: '/dashboard-v2',
                      templateUrl: '/static/templates/app_dashboard_v2.html',
                      resolve: {
                        deps: ['uiLoad',
                          function(uiLoad){
                            return uiLoad.load(['static/js/controllers/chart.js']);
                        }]
                      }
                    })
                    .state('app.chart', {
                        url: '/chart',
                        templateUrl: '/static/templates/ui_chart.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('static/js/controllers/chart.js');
                                }
                            ]
                        }
                    })
                    .state('app.table', {
                      url: '/table',
                      template: '<div ui-view></div>'
                    })
                    .state('app.table.static', {
                      url: '/static',
                      templateUrl: '/static/templates/table_static.html'
                    })
                    .state('app.table.datatable', {
                      url: '/datatable',
                      templateUrl: '/static/templates/table_datatable.html'
                    })
                    .state('app.table.footable', {
                      url: '/footable',
                      templateUrl: '/static/templates/table_footable.html'
                    })
                    .state('app.table.grid', {
                      url: '/grid',
                      templateUrl: '/static/templates/table_grid.html',
                      resolve: {
                          deps: ['uiLoad',
                            function(uiLoad){
                              return uiLoad.load('ngGrid').then(
                                  function(){
                                      return $ocLazyLoad.load('static/js/controllers/grid.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form', {
                      abstract: true,
                      url: '/form',
                      template: '<div ui-view class="fade-in"></div>',
                      resolve: {
                          deps: ['uiLoad',
                            function(uiLoad){
                              return uiLoad.load('static/js/controllers/form.js');
                          }]
                      }
                    })
                    .state('app.form.elements', {
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
                    .state('app.form.fileupload', {
                      url: '/fileupload',
                      templateUrl: '/static/templates/form_fileupload.html',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function( $ocLazyLoad){
                              return $ocLazyLoad.load('angularFileUpload').then(
                                  function(){
                                     return $ocLazyLoad.load('static/js/controllers/file-upload.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form.imagecrop', {
                      url: '/imagecrop',
                      templateUrl: '/static/templates/form_imagecrop.html',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function( $ocLazyLoad){
                              return $ocLazyLoad.load('ngImgCrop').then(
                                  function(){
                                     return $ocLazyLoad.load('js/controllers/imgcrop.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form.select', {
                      url: '/select',
                      templateUrl: '/static/templates/form_select.html',
                      controller: 'SelectCtrl',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function( $ocLazyLoad ){
                              return $ocLazyLoad.load('ui.select').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/select.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form.slider', {
                      url: '/slider',
                      templateUrl: '/static/templates/form_slider.html',
                      controller: 'SliderCtrl',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function($ocLazyLoad ){
                              return $ocLazyLoad.load('vr.directives.slider').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/slider.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form.editor', {
                      url: '/editor',
                      templateUrl: '/static/templates/form_editor.html',
                      controller: 'EditorCtrl',
                      resolve: {
                          deps: ['$ocLazyLoad',
                            function($ocLazyLoad ){
                              return $ocLazyLoad.load('textAngular').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/editor.js');
                                  }
                              );
                          }]
                      }
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
                                    ['static/vendor/jquery/fullcalendar/fullcalendar.css',
                                        'static/vendor/jquery/fullcalendar/theme.css',
                                        'static/vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                        'static/vendor/libs/moment.min.js',
                                        'static/vendor/jquery/fullcalendar/fullcalendar.min.js',
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
                .state('app.mail', {
                    abstract: true,
                    url: '/mail',
                    templateUrl: '/static/templates/mail.html',
                    // use resolve to load other dependences
                    resolve: {
                        deps: ['uiLoad',
                          function( uiLoad ){
                            return uiLoad.load( ['static/js/app/mail/mail.js',
                                                 'static/js/app/mail/mail-service.js',
                                                 'static/vendor/libs/moment.min.js'] );
                        }]
                    }
                })
                .state('app.mail.list', {
                    url: '/inbox/{fold}',
                    templateUrl: '/static/templates/mail.list.html'
                })
                .state('app.mail.detail', {
                    url: '/{mailId:[0-9]{1,4}}',
                    templateUrl: '/static/templates/mail.detail.html'
                })
                .state('app.mail.compose', {
                    url: '/compose',
                    templateUrl: '/static/templates/mail.new.html'
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
                                    return uiLoad.load(['static/js/app/note/note.js',
                                        'static/vendor/libs/moment.min.js'
                                    ]);
                                }
                            ]
                        }
                    })
                    .state('apps.contact', {
                        url: '/contact',
                        templateUrl: 'static/templates/apps_contact.html',
                        resolve: {
                            deps: ['uiLoad',
                                function(uiLoad) {
                                    return uiLoad.load(['static/js/app/contact/contact.js']);
                                }
                            ]
                        }
                    })
            }
        ]
    );