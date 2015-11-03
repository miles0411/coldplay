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
                    .otherwise('/app/profile');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '/static/templates/app.html'
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
                    .state('app.profile', {
                        url: '/profile',
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
                          deps: ['uiLoad', '$ocLazyLoad',
                            function(uiLoad){
                              return uiLoad.load('ngGrid').then(
                                  function($ocLazyLoad){
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
                                     return $ocLazyLoad.load('static/js/controllers/imgcrop.js');
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
                                      return $ocLazyLoad.load('static/js/controllers/select.js');
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
                                      return $ocLazyLoad.load('static/js/controllers/slider.js');
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
                                      return $ocLazyLoad.load('static/js/controllers/editor.js');
                                  }
                              );
                          }]
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