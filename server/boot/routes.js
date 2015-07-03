module.exports = function(server) {
	//This route is added for the server health monitoring
	server.use('/ping', function(req, res, next) {
	  res.send('Hello from MedSearch!!!');
	});
};