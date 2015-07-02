(function(){
    'use strict';
    
    angular

        // Inject modules used by the application
        .module( 'app', [
            'templates-app',
            'templates-common',
            'ui.router',
            'ui.bootstrap',
            'restangular',
            'angular.filter',
            'angular-chartist',
            'angular-ladda',
            'angular.morris-chart',
            'angular-growl',
            'highcharts-ng',
            'angularMoment',
            'readMore'
        ])

        // Declare any global configurations
        .config( function initRoutes ($locationProvider, $urlRouterProvider, $stateProvider, RestangularProvider, $provide, laddaProvider, growlProvider) {
            $urlRouterProvider.otherwise( '/' );
             RestangularProvider.setBaseUrl('/api');
            $provide.decorator('$uiViewScroll', function ($delegate, $stateParams, $location, $document) {
                return function (uiViewElement) {
                    $document.scrollTop(0, 0);
                };
            });
            laddaProvider.setOption({ 
              style: 'zoom-in'
            });
            growlProvider.globalPosition('top-right');
            growlProvider.globalDisableCountDown(true);
            growlProvider.globalTimeToLive({success: 5000, error: 8000, warning: 5000, info: 5000});

            $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector) {
                return function(exception, cause) {
                    var growl = $injector.get("growl");
                    $delegate(exception, cause);
                    growl.error("There was an issue: " + exception.message);
                };
            }]);

            //$locationProvider.html5Mode(true);
        })

        // Initiate the application
        .controller( 'AppController', function AppController ($scope, $state, $location,  appName, appVersion, connections) {
            $scope.appName = appName;
            $scope.appVersion = appVersion;
            $scope.connections = connections;            

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.showLoader = 1;
            });

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                 $scope.showLoader = 0;
            });
            $scope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
                $scope.showLoader = 0;                
            });
        })

        // Declare application name and version
        .constant('appName', 'Octo | 18F')
        .constant('appVersion', '1.0.0')

        // Main Run Function
        .run( function initApplication ($rootScope, $state, Restangular, growl, connections, suggestionsConnections) {

            $rootScope.$state = $state;

            Restangular.addRequestInterceptor(function(data, operation, what, url, response, deferred) {
                if(url) {
                    if(url.indexOf("/suggestions") === -1) {
                        connections.addConnection();
                    }
                    else if(url.indexOf("/suggestions") > -1) {
                        suggestionsConnections.addConnection();
                    }
                    return data;
                }

            });

            Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {        

                if(url) {    
                    if(url.indexOf("/suggestions") === -1) {
                        connections.removeConnection();
                    }
                    else if(url.indexOf("/suggestions") > -1) {
                        suggestionsConnections.removeConnection();
                    }
                    return data;
                }
            });

            Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
                
                if (response.status === 404 || response.status === 500) {
                    growl.error(response.data.message);
                }
                if(response.config.url.indexOf("/suggestions") === -1) {
                    connections.removeConnection();
                }
                else if(response.config.url.indexOf("/suggestions") > -1) {
                    suggestionsConnections.removeConnection();
                }               
                return true;
                
            });

        })
        ;
})();

