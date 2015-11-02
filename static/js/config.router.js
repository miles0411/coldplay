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
                    .state('app.dashboard-v1', {
                      url: '/dashboard-v1',
                      templateUrl: '/static/templates/app_dashboard_v1.html',
                      resolve: {
                        deps: ['ocLazyLoad',
                          function( $ocLazyLoad ){
                            return $ocLazyLoad.load(['js/controllers/chart.js']);
                        }]
                      }
                    })
                    .state('app.dashboard-v2', {
                      url: '/dashboard-v2',
                      templateUrl: '/static/templates/app_dashboard_v2.html',
                      resolve: {
                        deps: ['ocLazyLoad',
                          function( $ocLazyLoad ){
                            return $ocLazyLoad.load(['js/controllers/chart.js']);
                        }]
                      }
                    })
                    .state('app.chart', {
                        url: '/chart',
                        templateUrl: '/static/templates/ui_chart.html',
                        resolve: {
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('static/js/controllers/chart.js');
                                }
                            ]
                        }
                    })
              // table
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
                          deps: ['ocLazyLoad',
                            function( $ocLazyLoad ){
                              return $ocLazyLoad.load('ngGrid').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/grid.js');
                                  }
                              );
                          }]
                      }
                    })
                    .state('app.form', {
                      url: '/form',
                      template: '<div ui-view class="fade-in"></div>',
                      resolve: {
                          deps: ['uiLoad',
                            function( uiLoad){
                              return uiLoad.load('js/controllers/form.js');
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
                          deps: ['ocLazyLoad',
                            function($ocLazyLoad){
                              return $ocLazyLoad.load('angularFileUpload').then(
                                  function(){
                                     return $ocLazyLoad.load('js/controllers/file-upload.js');
                                  }
                              );
                          }]
                      }
                    })
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
                            deps: ['ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['static/js/controllers/signin.js']);
                                }
                            ]
                        }
                    })
                    .state('access.404', {
                        url: '/404',
                        templateUrl: '/static/templates/page_404.html'
                    })
                    .state('app.form.imagecrop', {
                      url: '/imagecrop',
                      templateUrl: '/static/templates/form_imagecrop.html',
                      resolve: {
                          deps: ['ocLazyLoad',
                            function($ocLazyLoad){
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
                          deps: ['ocLazyLoad',
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
                          deps: ['ocLazyLoad',
                            function( $ocLazyLoad ){
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
                          deps: ['ocLazyLoad',
                            function( $ocLazyLoad ){
                              return $ocLazyLoad.load('textAngular').then(
                                  function(){
                                      return $ocLazyLoad.load('js/controllers/editor.js');
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
                            deps: ['$ocLazyLoad', 'uiLoad',
                                function($ocLazyLoad, $uiLoad) {
                                    return $ocLazyLoad.load(
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

            }
        ]
    );