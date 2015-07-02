var request = require('request');
var utils = require('../utils/utility');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('drug');

module.exports = function(Drug) {
/**
  This method checks whether the passed in drugname exists in the drugarray
*/
isDrugExist = function(drugArray, drugName){
  var result = false;
  for(var i in drugArray){
    if(drugName == drugArray[i].name){
      return true;
    }
  }
  return result;
}

//Implementation of Drug suggestion REST API endpoint (for Autocomplete on Drug search).
//Given a Drug Partial Name return an array  of matching Drug Objects
Drug.findSuggestions = function(q, cb){
	logger.debug('Enterd findSuggestions method');
  //Fetching the search API
  q = utils.removeSpecialChars(q);
  var fdaAPI = utils.getSearchQuery(q);
  logger.debug('fdaAPI:: '+ fdaAPI);
  //Making the API call
  request(fdaAPI, 
          function (error, response, body) {
    var drugSuggestions = [];  
    //if error returning error object  
    if(error){
      logger.debug('Error happened');
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
      q = utils.capitalizeString(q);
      //Converting response bidy to JSON object
      var responseOBJ = JSON.parse(body);
      var results = responseOBJ.results;
      for(var i in results) {
        //Limitng the suggestions to 10
         if(drugSuggestions.length == 10){
            break;
         }
         var drugItem = results[i];
         if(drugItem.set_id){

            //Looping brandnames to find the matches
            if(drugItem.openfda.brand_name){
              var brandNames = drugItem.openfda.brand_name;
              for(var j in brandNames){
                 var brandName = utils.capitalizeString(brandNames[j]);
                  //logger.debug('brandName:::'+brandName);
                 if(brandName.indexOf(q) > -1 && !isDrugExist(drugSuggestions, brandName)){
                  var drugSuggestion = {};
                  drugSuggestion.name =  brandName;
                  drugSuggestion.indicator = "brand";
                  drugSuggestions.push(drugSuggestion);
                 }
              }
            }  

            //Looping generic names to find the matches
            if(drugItem.openfda.generic_name){
               var genericNames = drugItem.openfda.generic_name;
                for(var k in genericNames){
                 var genericName = utils.capitalizeString(genericNames[k]);
                 //logger.debug('genericName:::'+genericName);
                 if(genericName.indexOf(q) > -1 && !isDrugExist(drugSuggestions, genericName)){
                  var drugSuggestion = {};
                  drugSuggestion.name =  genericName;
                  drugSuggestion.indicator = "generic";
                  drugSuggestions.push(drugSuggestion);
                 }
              }
            } 

         }         
      }      
    }
    return cb(null, drugSuggestions);
  });
};

//Implementation of Drug details REST API endpoint.
//Given a Complete Drug Name return a JSON object containing Drug Details
Drug.getDrugDetails = function(q, typ, cb){
   var fdaLabelURL = Drug.app.get("fdaDrugLabelApi");
   var apiKey = Drug.app.get("fdaApiKey");
   fdaLabelURL = fdaLabelURL + 'api_key='+ apiKey; 
   q = utils.removeSpecialChars(q);
   if(typ == 'brand')
      fdaLabelURL = fdaLabelURL + '&search=brand_name:"'+q+'"';
   else if(typ == 'generic')   
      fdaLabelURL = fdaLabelURL + '&search=generic_name:"'+q+'"'; 

   logger.debug('fdaLabelURL:: '+ fdaLabelURL);
   request(fdaLabelURL, function (error, response, body) {
    if(error){
      logger.debug('Error happened in retrieving the drug label information');
      error.message = 'Your search could not be made at this time.';
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
       var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       var meta = responseOBJ.meta;
       if(results.length != 0){          
          var drugModel = {};
          drugModel.brand_name =  results[0].openfda.brand_name;
          drugModel.generic_name =  results[0].openfda.generic_name;
          drugModel.purpose =  ((results[0].description == null || results[0].description == '') ? results[0].purpose : results[0].description);
          drugModel.count = meta.results.total;

          return cb(null, drugModel);         
       }    
    }else{
      error = new Error();
      error.statusCode = 400;
      error.message = 'No results were found for your search.';
      return cb(error);
    }   
   });
};

//REST API Endpoint Configuration
Drug.remoteMethod(
    'findSuggestions',
    {
      description: 'Fetch suggestions for a given partial drug name',
      accepts: {arg: 'q', type: 'string', required: true, description:'Partial Drug Name'},
      returns: {arg: 'result', type: 'array', description:'Matching Drug Names'},
      http: {path: '/suggestions', verb: 'get'}
    }
  );

Drug.remoteMethod(
    'getDrugDetails',
    {
      description: 'Fetch drug details for the given drug name and drug type',
      accepts: [{arg: 'q', type: 'string', required: true, description:'Complete Drug Name'},
                {arg: 'typ', type: 'string', required: true, description:'Drug Type (genric OR brand)'}],
      returns: {arg: 'drug', type: 'object', description:'Drug Details object'},
      http: {path: '/details', verb: 'get'}
    }
  );

};
