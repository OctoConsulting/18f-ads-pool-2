var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('recall');
var utils = require('../utils/utility');

module.exports = function(Recall) {

//Implementation of Rest End Point for '/recalls' path, return Response with "response" JSON object with metadata and 
//an array of recall details given a brand or generic drug  
Recall.getRecallDetails = function(q, typ, limit, skip, reason, fromDate, toDate, cb){
   var fdaRecallURL = Recall.app.get('fdaDrugEnforcementApi') + 'api_key=' + Recall.app.get('fdaApiKey') +  '&search=';
   q = utils.removeSpecialChars(q);
   if(typ === 'generic')
  	 fdaRecallURL = fdaRecallURL + 'openfda.generic_name.exact:"'+ q +'"' ;
   if(typ === 'brand')
     fdaRecallURL =  fdaRecallURL + 'openfda.brand_name.exact:"'+ q +'"' ;


     //Append additional filters
     var filters = utils.buildFilterUrlForRecall(reason, fromDate, toDate);
     if(filters != '') {
        fdaRecallURL = fdaRecallURL + filters;
     }

     var lim = parseInt(limit);
     if(!isNaN(lim)) { 
     	fdaRecallURL = fdaRecallURL + '&limit=' + lim;
     }

     var start = parseInt(skip);
     if(!isNaN(start)) { 
     	fdaRecallURL = fdaRecallURL + '&skip=' + start;
     }     

   logger.debug('fdaRecallURL:: '+ fdaRecallURL);
   request(fdaRecallURL, function (error, response, body) {
    if(error){
      logger.error('Error occured when retrieving the drug recall information');

      return cb(error); 
    } else if (!error && response.statusCode == 200) {
       var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       var meta = responseOBJ.meta;
       var recalls = [];
       var response = {};
       if(results.length != 0){          
          var recallObj = {};
          //Set results metadata
          response.count = meta.results.total;
          response.skip = meta.results.skip;
          response.limit = meta.results.limit;

          for(var i=0; i < results.length; i++) {
	          //Set Recall details
	          var recallDetails = {};
	          recallDetails.recall_number = results[i].recall_number;
            if(results[i].recall_initiation_date){
              var date = results[i].recall_initiation_date;
              recallDetails.recall_initiation_date = date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
            }	          
	          recallDetails.reason_for_recall = results[i].reason_for_recall;
	          recallDetails.distribution_pattern = results[i].distribution_pattern;
	          recallDetails.recalling_firm = results[i].recalling_firm;
	          recallDetails.product_description = results[i].product_description;
	          recallDetails.product_quantity = results[i].product_quantity;

	          recalls.push(recallDetails);
	      }
	      response.recalls = recalls;
  
          return cb(null, response);         
       }    
    } 
    else{
      return cb(null, {});
    }   
   });
};

//REST Endpoint Configuration
Recall.remoteMethod(
    'getRecallDetails',
    {
      description: 'Fetch drug recall details for a given drug name, type and other filters',
      accepts: [{arg: 'q', type: 'string', required: true, description:'Drug Name'},
                {arg: 'typ', type: 'string', required: true, description:'Drug Type (valid values: generic or brand)'},
                {arg: 'limit', type: 'string', required: true, description:'Number of records to return (valid values: from 1 - 100)'},
                {arg: 'skip', type: 'string', required: true, description:'Number of records to skip (valid values: upto 0 - 5000)'},
                {arg: 'reason', type: 'string', description:['Recall Reason from valid values. valid values:',
                               '"Lack of Assurance of Sterility"',
                               '"Penicillin Cross Contamination"',
                               '"Labeling"',
                               '"adverse reactions"',
                               '"Subpotent Drug"',
                               '"Contamination"',
                               '"Presence of Particulate Matter"',
                               '"Tablet"']},
                {arg: 'fromDate', type: 'string', description: [
                              'Recall Reported From Date.',                             
                              'valid format is yyyymmdd or yyyy-mm-dd']},
                {arg: 'toDate', type: 'string', description: [
                              'Recall Reported To Date.',                             
                              'valid format is yyyymmdd or yyyy-mm-dd']}],
      returns: {arg: 'response', type: 'object', description:'Drug Name'},
      http: {path: '/', verb: 'get'}
    }
  );


};