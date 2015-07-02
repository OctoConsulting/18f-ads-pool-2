var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');

describe('Test Drug Model', function(){
	
	 describe('Test REST API - findSuggestions', function(){
	 	it('End-to-End Test', function(done){
	 		this.timeout(30000);
	 		supertest(app).get("/api/drugs/suggestions?q=Tyl").expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		done();
	 		});	
	 	});
	 });

	 describe('Test REST API - getDrugDetails', function(){
	 	this.timeout(30000);
	 	it('End-to-End Test', function(done){
	 		supertest(app).get("/api/drugs/details?q=ACETAMINOPHEN&typ=generic").expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		done();
	 		});	
	 	});
	 });
});