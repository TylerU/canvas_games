var http = require('http')
, url = require('url')
, fs = require('fs')
, server;

server = http.createServer(function(req, res){
// your normal server code
var path = url.parse(req.url).pathname;
switch (path){
case '/':
res.writeHead(200, {'Content-Type': 'text/html'});
res.write('<h1>Hello! Try the <a href="../index.html">Socket.io Test</a></h1>');
res.end();
break;
case '/index.html':
fs.readFile(__dirname + path, function(err, data){
if (err) return send404(res);
res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'})
res.write(data, 'utf8');
res.end();
});
break;

default: send404(res);
}
}),

send404 = function(res){
res.writeHead(404);
res.write('404');
res.end();
};

server.listen(8080);

// socket.io, I choose you
var io = require('C:/Programming stuff/Javascript and Node/node_modules/socket.io').listen(server);

// on a 'connection' event
io.sockets.on('connection', function(socket){

  console.log("Connection " + socket.id + " accepted.");
    
  // now that we have our connected 'socket' object, we can 
  // define its event handlers
  socket.on('message', function(message){
        console.log("Received message: " + message + " - from client " + socket.id);
        socket.emit( "message" ,"This is a test")
  });
    
  socket.on('disconnect', function(){
    console.log("Connection " + socket.id + " terminated.");
  });
    
});



require("js/Vector.js")
require("js/Timer.js")      
require("js/Components.js")
require("js/SubSystems.js")
require("js/EntityManager.js")
require("js/Factory.js")




var main = function () {
	var now = Date.now();
	var delta = now - then;
	delta = delta/1000;

	
	for (var j = 0; j < SubSystems.length; j++){
		SubSystems[j].update(delta);	
	}
	
	var spawnRate = .06 + Math.floor(killCount / 20) * .1;
	if ((currentEnemyCount< Math.ceil(killCount/6)) && Math.random() < .06){
		CreateBadGuy();
	}
	
	then = now;
	requestAnimFrame(main, canvas);
};


var SubMovement = new SubSystemMovement(EntityManager);
var SubShipController = new SubSystemShipController(EntityManager);
var SubHumanInput = new SubSystemHumanInput(EntityManager);
var SubArtificialInput = new SubSystemArtificialInput(EntityManager);
var SubDelete = new SubSystemDeletetions(EntityManager, ctx);
var SubParticles = new SubSystemParticles(EntityManager);
var SubCollisions = new SubSystemCollisions(EntityManager);
var SubGuns = new SubSystemGuns(EntityManager);
var SubPositions = new SubSystemSpatial(EntityManager);


var SubSystems = [SubMovement, SubShipController, SubArtificialInput, SubDelete, SubParticles, SubCollisions, SubGuns, SubPositions];

var backThen = 0;
var killCount = 0;
var currentEnemyCount = 0;	
					
var init = function(){
	then = Date.now();
	backThen = Date.now();
	for (var i = 3; i < 5; i++){
		CreateBadGuy();	
	}
	main();
}


init();