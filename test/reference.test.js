var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
describe('Test Reference Model', function(){
	 describe('Test REST API - fetchReferences', function(){

	 	it('should bring back reference values', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/references').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		var responseOBJ = res.body; 
		 		responseOBJ.response.age[0].maxAge.should.equal(10);		 		
		 		done();
	 		});	
	 	});

	 });	

});