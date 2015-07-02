(function(){
    'use strict';

    angular.module('app')


        .controller( 'MenuController', MenuController);

        // Home controller
        function MenuController($scope, Restangular, $state) {

            $scope.search = function () {
                $state.go('details.events', {typ: $scope.query.indicator, name: $scope.query.name});
            };

            // Function to get suggestions from the users search 
            $scope.getSuggestions = function(val) {
                return Restangular.one('drugs').customGET('suggestions',{'q':val})
                .then(function(data) {
                    if(data.result.length) {
                        return data.result.map(function(item){
                            return item;
                        });
                    }
                    else {
                        return [{"name":"No results found."}];
                    }

                }, function() {
                    
                });
            };
        }
})();

