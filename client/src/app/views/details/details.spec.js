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
  var DetailsCtrl;
  var detailsData = {"drug":{"brand_name":["Infants TYLENOL"],"purpose":["Purpose Pain reliever/fever reducer"],"generic_name":["ACETAMINOPHEN"],"count":["3001"]}};

  // Inject providers and initialize controller
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      DetailsCtrl = $controller( 'DetailsController', { $scope: scope, detailsData: detailsData, eventsData:{"response":{}}, recallsData:{"response":{}},referenceData:{"response":{}} });
   }));

  it( 'should return drug details', inject( function() {
   
    // Check if the details is in the correct format
     expect(scope.details.drug.generic_name[0]).toEqual("ACETAMINOPHEN"); 
   

  }));

   it( 'should not equal the drug name', inject( function() {
   
    // Check if the details is in the correct format
     expect(scope.details.drug.generic_name[0]).not.toEqual("ACETAMI"); 
   

  }));

});

