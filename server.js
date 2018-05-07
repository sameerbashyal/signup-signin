var http= require('http');
var app= require('/app');
var port=process.env.PORT || 3200;
var server= http.createServer(app);
server.listen(port);