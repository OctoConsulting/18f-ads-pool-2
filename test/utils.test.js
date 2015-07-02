var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
var utils = require('../common/utils/utility.js')

describe('Test Utils Functions', function(){
	 describe('Test getToString', function(){
	 	it('should return TO string', function(done){
	 		var result = utils.getToString('Tyl');
	 	    result.should.match('Tym');

	 	    done();

	 	});
	 });

	 describe('Test getSearchQuery', function(){
	 	it('should return FDA REST API URL for search term', function(done){
	 		var result = utils.getSearchQuery('TYLENOL Regular Strengt');
	 	    result.should.match('https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=(openfda.brand_name:TYLENOL+AND+openfda.brand_name:Regular+AND+openfda.brand_name:[Strengt+TO+Strengu])+OR+(openfda.generic_name:TYLENOL+AND+openfda.generic_name:Regular+AND+openfda.generic_name:[Strengt+TO+Strengu])&limit=25');

	 	    done();

	 	});
	 });	 

	 describe('Test buildFilterUrlForRecall', function(){
	 	it('should return search term for additional filter', function(done){
	 		var result = utils.buildFilterUrlForRecall('Labeling');
	 	    result.should.match('+AND+reason_for_recall:"Labeling:"');

	 	    done();

	 	});
	 });	

	 describe('Test removeSpecialChars', function(){
	 	it('should return modified string with special characters removed', function(done){
	 		var result = utils.removeSpecialChars('ACETAMENOPHEN, HYDRO! CHLORIDE');
	 	    result.should.match('ACETAMENOPHEN HYDRO CHLORIDE');

	 	    done();

	 	});
	 });		

	 describe('Test getFormattedDt', function(){
	 	it('should return modified string with the formatted date', function(done){
	 		var result = utils.getFormattedDt('2012-09-14');
	 	    result.should.match('20120914');

	 	    done();

	 	});
	 });		   
});