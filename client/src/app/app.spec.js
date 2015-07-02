describe( 'AppController', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'app' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppController', { $location: $location, $scope: $scope });
    }));

    it( 'should know the name and version of the app', inject( function() {
      expect($scope.appName).toBe('Octo | 18F');
      expect($scope.appVersion).toBe('1.0.0');
    }));


  });
});
