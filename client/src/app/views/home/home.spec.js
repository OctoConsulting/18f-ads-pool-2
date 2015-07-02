/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */

describe( 'Home', function() {
  beforeEach( module( 'app') );
  beforeEach( module( 'ngMockE2E') );
  
  // Global Vars
  var scope;
  var HomeCtrl;

  // Inject providers and initialize controller
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      HomeCtrl = $controller( 'HomeController', { $scope: scope });
   }));

  it( 'should return drug name suggestions', inject( function() {

    // This is the mock for the back end call
    $httpBackend.expect('GET', '/api/drugs/suggestions?q=Tyl')
        .respond({result: [{"id":"0027e3a2-862a-474d-8c33-dda1a2264b27","name":"Infants TYLENOL","indicator":"brand"}]});
  
    // Call the controller function and see if the returned suggestions are in the correct format
    scope.getSuggestions('Tyl').then(function(suggestions) {
      expect(suggestions[0].name).toEqual("Infants TYLENOL");
    });

    // Perform the async ajax call
    $httpBackend.flush();

  }));

  it( 'should return no results found for non-existing name', inject( function() {

    // This is the mock for the back end call
    $httpBackend.expect('GET', '/api/drugs/suggestions?q=Xyz')
        .respond({result: [{"name":"No results found."}]});
  
    // Call the controller function and see if the returned suggestions has "No results found."
    scope.getSuggestions('Xyz').then(function(suggestions) {
      expect(suggestions[0].name).not.toEqual("Infants TYLENOL");
      expect(suggestions[0].name).toEqual("No results found.");
    });

    // Perform the async ajax call
    $httpBackend.flush();

  }));

});

