(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'results', {
                url: '/results',
                views: {
                    "main": {
                        controller: 'ResultsController',
                        templateUrl: 'views/results/results.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' },
                resolve: {
                    resultData: function(Restangular, $stateParams) {
                        return Restangular.one('api').customGET('search',{'q':$stateParams.q});
                    }
                }
            })
            ;
        })
        .controller( 'ResultsController', ResultsController);

        function ResultsController($scope, Restangular, $state, resultData) {
            Restangular.one('drugs1').get();
        }
})();

