(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details.recalls', {
                url: '/recalls',
                views: {
                    "" : {
                        controller: 'DetailsRecallsController',
                        templateUrl: 'views/details/tabs/recalls/recalls.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' }
            })
            ;
        })
        .controller( 'DetailsRecallsController', DetailsRecallsController);

        function DetailsRecallsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.recalls = recallsData;
            $scope.recalls.filters = {};
            
            $scope.maxPerPage = 5;

            $scope.recalls.currentPage = 1;
            $scope.recalls.maxPages = 5;
            $scope.recalls.totalPages = Math.ceil($scope.recalls.response.count / $scope.maxPerPage);

            if($scope.recalls.totalPages > 1000) {
                $scope.recalls.totalPages = 1000;
            }

            $scope.recallsPageChanged = function () {
                $scope.recalls.pageChangeAction = 1;
                $scope.updateEvents();
            };

            $scope.getRelevantImage = function(date) {
                var threeYearsAgo = moment().subtract(3, 'years');
                var sixYearsAgo = moment().subtract(6, 'years');
                var tenYearsAgo = moment().subtract(10, 'years');
                var assets = '/assets/images/icons/';

                if(moment(date) > threeYearsAgo) {
                    return assets+'dials_V4_alert4.png';
                }
                else if(moment(date) <= threeYearsAgo && moment(date) > sixYearsAgo) {
                    return assets+'dials_V4_alert3.png';
                }
                else if(moment(date) <= sixYearsAgo && moment(date) > tenYearsAgo) {
                    return assets+'dials_V4_alert2.png';
                }
                else {
                    return assets+'dials_V4_alert1.png';
                }                            
            };

            $scope.updateRecalls = function () {

                var query = {'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.recalls.currentPage-1)*$scope.maxPerPage};

                if($scope.recalls.filters.time) {
                    if($scope.recalls.filters.time.minDt) {
                        query.toDate = moment().subtract($scope.recalls.filters.time.minDt, 'years').format("YYYY-MM-DD");
                    }

                    if($scope.recalls.filters.time.maxDt) {
                        query.fromDate = moment().subtract($scope.recalls.filters.time.maxDt, 'years').format("YYYY-MM-DD");
                    }
                }

                if($scope.recalls.filters.reason) {
                    query.reason = $scope.recalls.filters.reason.code;
                }

                Restangular.one('recalls').customGET('',query)
                .then(function(data) {
                    $scope.recalls.response = data.response;
                    $scope.recalls.pageChangeAction = 0;
                }, function() {
                    $scope.recalls.pageChangeAction = 0;
                });
            };

            $scope.updateRecallTimeframe = function (time) {
                if(time) {
                    $scope.recalls.filters.time = time;
                    $scope.recalls.currentPage = 1;
                }
                else {
                    delete($scope.recalls.filters.time);
                }
                $scope.updateRecalls();
            }; 

            $scope.updateReasons = function (reason) {
                if(reason) {
                    $scope.recalls.filters.reason = reason;
                    $scope.recalls.currentPage = 1;
                }
                else {
                    delete($scope.recalls.filters.reason);
                }
                $scope.updateRecalls();
            };
        }
})();

