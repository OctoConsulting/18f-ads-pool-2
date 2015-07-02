(function(){
	'use strict';

	angular.module('app')
        .config( function initRoutes( $stateProvider ) {
            $stateProvider
            .state( 'details', {
                url: '/details/:typ/:name',
                views: {
                    "menu": {
                        controller: 'MenuController',
                        templateUrl: 'views/menu/menu.tpl.html'
                    },
                    "main": {
                        controller: 'DetailsController',
                        templateUrl: 'views/details/details.tpl.html'
                    },
                    "footer": {
                        templateUrl: 'views/footer/footer.tpl.html'
                    }
                },
                data:{ pageTitle: 'Octo | 18F' },
                resolve: {
                    referenceData: function(Restangular) {
                        return Restangular.one('references').get();
                    },                
                    detailsData: function(Restangular, $stateParams) {
                        return Restangular.one('drugs').customGET('details',{'q':$stateParams.name,'typ':$stateParams.typ});
                    },
                    eventsData: function(Restangular, $stateParams) {
                        return Restangular.one('events').customGET('',{'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':5,'skip':0});
                    },
                    recallsData: function(Restangular, $stateParams) {
                        return Restangular.one('recalls').customGET('',{'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':5,'skip':0});
                    }
                }
            })
            ;
        })
        .controller( 'DetailsController', DetailsController);

        function DetailsController($log, $scope, Restangular, $state, detailsData, $stateParams, eventsData, recallsData, referenceData) {
            $scope.references = referenceData.response;
            $scope.details = detailsData;
            $scope.indicator = $stateParams.typ;
            $scope.name = $stateParams.name;
            $scope.tabState = 'recalls';
            $scope.events = eventsData;
            $scope.recalls = recallsData;
            $scope.events.filters = {};
            $scope.recalls.filters = {};
            
            $scope.maxPerPage = 5;

            $scope.events.currentPage = 1;
            $scope.events.maxPages = 5;
            $scope.events.totalPages = Math.ceil($scope.events.response.count / $scope.maxPerPage);

            $scope.recalls.currentPage = 1;
            $scope.recalls.maxPages = 5;
            $scope.recalls.totalPages = Math.ceil($scope.recalls.response.count / $scope.maxPerPage);

            if($scope.events.totalPages > 1000) {
                $scope.events.totalPages = 1000;
            }

            if($scope.recalls.totalPages > 1000) {
                $scope.recalls.totalPages = 1000;
            }

            $scope.eventsPageChanged = function () {
                $scope.events.pageChangeAction = 1;
                $scope.updateEvents();
            };

            $scope.recallsPageChanged = function () {
                $scope.recalls.pageChangeAction = 1;
                Restangular.one('recalls').customGET('',{'q':$stateParams.name.toUpperCase(),'typ':$stateParams.typ,'limit':$scope.maxPerPage,'skip':($scope.recalls.currentPage-1)*$scope.maxPerPage})
                .then(function(data) {
                    $scope.recalls.response = data.response;
                    $scope.recalls.pageChangeAction = 0;
                }, function() {
                    $scope.recalls.pageChangeAction = 0;
                });
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

                Restangular.one('events').customGET('',query)
                .then(function(data) {
                    $scope.events.response = data.response;
                    $scope.events.pageChangeAction = 0;
                }, function() {
                    $scope.events.pageChangeAction = 0;
                });
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
                    $scope.events.pageChangeAction = 0;
                }, function() {
                    $scope.recalls.pageChangeAction = 0;
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

