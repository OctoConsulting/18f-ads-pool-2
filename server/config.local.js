module.exports = {
  restApiRoot: "/api",
  host: "0.0.0.0",
  port: 3000,
  remoting :  {
    "context": {
      "enableHttpContext": false
    },
    "rest": {
      "normalizeHttpPath": false,
      "xml": false
    },
    "json": {
      "strict": false,
      "limit": "100kb"
    },
    "urlencoded": {
      "extended": true,
      "limit": "100kb"
    },
    "cors": false,
    "errorHandler": {
      "disableStackTrace": false
    }
  },
  legacyExplorer: false,
  fdaApiKey: 'yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi',
  fdaDrugEventApi: 'https://api.fda.gov/drug/event.json?',
  fdaDrugLabelApi: 'https://api.fda.gov/drug/label.json?',
  fdaDrugEnforcementApi: 'https://api.fda.gov/drug/enforcement.json?'
};
