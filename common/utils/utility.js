//Given a string , return a modified string with last character changed to next ASCII sequence character
var toStr = module.exports.getToString = function (str) {
    if(!str) return null;
    var lastChar = str.charCodeAt(str.length-1);

    var nextChar = String.fromCharCode(lastChar+1);
    var newString = str.slice(0,str.length-1) + nextChar;    
    
    return newString;
};

//Given a string return a string with first letter in Uppercase and following characters in Lowercase
module.exports.capitalizeString = function (str) {
  if(!str) return null;
  var str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

//Return a string for search term based on given partial string
module.exports.getSearchQuery = function (str) {
   var res = str.split(' ');	
   var range = '(';

   for(var i=0; i < res.length; i++) {
     if(i > 0) range = range + '+AND+'; //Joining Terms by AND
     if(i === (res.length-1)) { //Last token should be range
     	range = range + 'openfda.brand_name:[' + res[i] + '+TO+' + toStr(res[i]) + '])';
     } else {
     	range = range + 'openfda.brand_name:' + res[i]; //Else append exact term
     }
   }

   var genericRange = range.replace(/brand_name/g, 'generic_name');
   var result = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=';
   //var range = '[' + str + '+TO+' + toStr(str) + ']';
   result = result + range + '+OR+' + genericRange +'&limit=25';

   return result;
};

//Return String in yyyymmdd format for date input in yyyy-mm-dd
var fnDtFormat = module.exports.getFormattedDt = function(date) {
  if(date) {
    return date.replace(/-/g,"");  
  }
};

//Build search Filetetr list for FDA Recalls API
module.exports.buildFilterUrlForRecall = function (reason, fromDate, toDate) 
{  var result = '';
   
  if(reason) {
    if(reason === 'Contamination') {
      result = result + '+AND+(reason_for_recall:"Chemical Contamination"'+
                        '+OR+reason_for_recall:"Impurities Degradation Products"' +
                        '+OR+reason_for_recall:"Microbial Contamination"' +
                        '+OR+reason_for_recall:"Presence of Foriegn Substance"' +
                        '+OR+reason_for_recall:"Failed Impurities Specifications")';
    } else if (reason === 'Tablet') {
      result = result + '+AND+(reason_for_recall:"Failed Tablet Capsule Specifications"'+
                        '+OR+reason_for_recall:"Presence of Foreign Tablets")';
    } else {
      result = result + '+AND+reason_for_recall:"' + reason + ':"';
    }
  }
  if(fromDate && toDate) {
    result = result + '+AND+report_date:[' + fnDtFormat(fromDate) + '+TO+' + fnDtFormat(toDate) + ']';
  }
  if(fromDate && !toDate) {
    result = result + '+AND+report_date:>=' + fnDtFormat(fromDate);
  }   
  if(!fromDate && toDate) {
    result = result + '+AND+report_date:<=' + fnDtFormat(toDate);
  }   
  return result;
};

//Remove characters not suppported by FDA Search APIs
module.exports.removeSpecialChars = function (str) {
  return str.replace(/[`~!@#$%^&*|\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};