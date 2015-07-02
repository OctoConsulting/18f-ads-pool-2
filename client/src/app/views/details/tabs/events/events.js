(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details.events', {
                url: '/events',
                views: {
                    "" : {
                        controller: 'DetailsEventsController',
                        templateUrl: 'views/details/tabs/events/events.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' },
                resolve: {
                    eventReactionChartData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('reactions',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventOutcomesChartData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('reactionOutComes',{'q':$stateParams.name,'typ':$stateParams.typ});
                    }                    
                }
            })
            ;
        })
        .controller( 'DetailsEventsController', DetailsEventsController);

        function DetailsEventsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData, eventReactionChartData, eventOutcomesChartData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.events = eventsData;
            $scope.events.filters = {};
            $scope.charts = {};
            $scope.charts.events = {};
            $scope.charts.events.reactions = eventReactionChartData.result;
            $scope.charts.events.outcomes = eventOutcomesChartData.results;
            $scope.charts.events.colors1 = ["#B0A248","#9F9341","#827835","#746B2F","#655D29"];
            $scope.charts.events.colors2 = ["#9AB45C","#8DA84D","#819A47","#758C40","#697E3A","#5E7033"];
            $scope.maxPerPage = 5;

            $scope.events.currentPage = 1;
            $scope.events.maxPages = 5;
            $scope.events.totalPages = Math.ceil($scope.events.response.count / $scope.maxPerPage);

            if($scope.events.totalPages > 1000) {
                $scope.events.totalPages = 1000;
            }

            $scope.recallsPageChanged = function () {
                $scope.recalls.pageChangeAction = 1;
                $scope.updateRecalls();
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

            $scope.updateEvents = function () {

                var query = {'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.events.currentPage-1)*$scope.maxPerPage};

                if($scope.events.filters.gender) {
                    query.gender = $scope.events.filters.gender.code;
                }

                if($scope.events.filters.age) {
                    if($scope.events.filters.age.minAge) {
                        query.minAge = $scope.events.filters.age.minAge;
                    }

                    if($scope.events.filters.age.maxAge) {
                        query.maxAge = $scope.events.filters.age.maxAge;
                    }
                }

                if($scope.events.filters.time) {
                    if($scope.events.filters.time.minDt) {
                        query.toDate = moment().subtract($scope.events.filters.time.minDt, 'years').format("YYYY-MM-DD");
                    }

                    if($scope.events.filters.time.maxDt) {
                        query.fromDate = moment().subtract($scope.events.filters.time.maxDt, 'years').format("YYYY-MM-DD");
                    }
                }

                if($scope.events.filters.severity) {
                    query.seriousness = $scope.events.filters.severity.code;
                }

                Restangular.one('events').customGET('reactions',query)
                .then(function(data) {
                    $scope.charts.events.reactions = data.result;
                }, function() {
                });

                Restangular.one('events').customGET('reactionOutComes',query)
                .then(function(data) {
                    $scope.charts.events.outcomes = data.results;
                }, function() {
                });

                Restangular.one('events').customGET('',query)
                .then(function(data) {
                    $scope.events.response = data.response;
                    $scope.events.pageChangeAction = 0;
                }, function() {
                    $scope.events.pageChangeAction = 0;
                });
            };


            $scope.updateGender = function (gender) {
                if(gender) {
                    $scope.events.filters.gender = gender;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.gender);
                }
                $scope.updateEvents();
            };

            $scope.updateAge = function (age) {
                if(age) {
                    $scope.events.filters.age = age;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.age);
                }
                $scope.updateEvents();
            };    

            $scope.updateTimeframe = function (time) {
                if(time) {
                    $scope.events.filters.time = time;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.time);
                }
                $scope.updateEvents();
            }; 

            $scope.updateSeverity = function (severity) {
                if(severity) {
                    $scope.events.filters.severity = severity;
                    $scope.events.currentPage = 1;
                }
                else {
                    delete($scope.events.filters.severity);
                }
                $scope.updateEvents();
            }; 

            
        }
})();

