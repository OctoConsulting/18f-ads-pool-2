var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');

describe('Test Recalls Endpoint', function(){
	 describe('Test REST API - getRecallDetails', function(){
	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/recalls?q="ADVIL"&skip=0&limit=5&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		done();
	 		});	
	 	});

	 	it("Successful End-To-End Test - Search by generic", function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/recalls?q="XXXYYYZZZ"&skip=0&limit=5&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - with filters', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/recalls?q=PAROXETINE%20HYDROCHLORIDE&typ=brand&limit=1&skip=0&reason=Contamination').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		done();
	 		});	
	 	});	 	

	 });

});