/////////////////////////////////////////////////////////////////////////////////
// TO DO (Server.js):
// - Build relevant EntityMap for each attached socket
// - 
/////////////////////////////////////////////////////////////////////////////////


var http = require('http')
, url = require('url')
, fs = require('fs')
, server;
 
 var im = require('imagemagick');

server = http.createServer(function(req, res){
// your normal server code
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Hello! Try the <a href="./index.html">Socket.io Test</a></h1>');
			res.end();
			break;
		default:
			console.log(__dirname + path);
			fs.readFile(__dirname + path, function(err, data){
				if (err) return send404(res);
				res.writeHead(200, {'Content-Type': path.slice(path.length-3, path.length) == '.js' ? 'text/javascript' : 'text/html'})
				res.write(data, 'utf8');
				res.end();
			});
			break;

		//default: send404(res);
		}
}),

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(8080);

// socket.io, I choose you!
var io = require('C:/Programming stuff/Javascript and Node/node_modules/socket.io').listen(server, { log: false });

// on a 'connection' event
io.sockets.on('connection', function(socket){
	var sock = socket.id;//Create entries in the socket map and player map
	var play = Factory.CreatePlayer().name;
	
	socketMap[sock.toString()] = play;
	playerMap[play] = sock;
	
	//console.log(Object.keys(socketMap));
	
	console.log("Created player " + play + " on socket " + sock);
	console.log("Connection " + socket.id + " accepted.");
	// now that we have our connected 'socket' object, we can 
	// define its event handlers
	socket.on('message', function(message){
		var msg = JSON.parse(message);
		//console.log("Received message: " + msg.event +   " - from client " + socketMap[socket.id]);
		
		switch (msg.event){
			case ('up'):
			case ('right'):
			case ('left'):
			case ('shoot'):
				if (EntityManager.getAllComponentsOf(socketMap[socket.id])){
					EntityManager.getComponent(socketMap[socket.id],"Input-Human")[msg.event] = msg.value;
				}
				//console.log(EntityManager.getComponent(socketMap[socket.id],"Spatial").x);
				//console.log("HERE");
				break;
		}
		//io.sockets.emit( "message" ,"This is a test")
		//io.sockets.emit("message", CreateEntityMap(EntityManager.entityMap, EntityManager.getComponent(play, "Spatial"), play).toString());
	});

	socket.on('disconnect', function(){
		//console.log("Connection " + socket.id + " terminated.");
		//console.log("Player " + socketMap[socket.id] + " terminated");
		EntityManager.removeEntity(socketMap[socket.id]);
		delete socketMap[socket.id];
		delete playerMap[socketMap[socket.id]];
		
		console.log("Player " + socketMap[socket.id] + " on socket " + socket.id + " information eradicated");
	});
    
});

global.Entity = function (compArr){
	this.name = EntityManager.createEntity();	

	for (var i = 0; i < compArr.length; i++){
		EntityManager.addComponent(this.name, compArr[i]);
	}
	
	return this.name;
}


global.Vec2 = require("./js/Vector.js");
//require("./js/Timer.js")      
global.Components = require("./js/Components.js");
var SubSystems = require("./js/SubSystems.js");
global.EntityManager = require("./js/EntityManager.js");
global.Factory = require("./js/Factory-Server.js");
var  JSON = require("./js/JSON.js");
//GLOBAL.Entity = require("./js/Entity.js");


global.fleshlingCollision = "Flesh";
global.bulletCollision = "Bullet";
global.powerUpCollision = "PowerUpCol";

global.client = false;

global.sizesMap = {};
global.socketMap = {};
global.playerMap = {};

function CreateEntityMap(eMap, location, who){
		kys = Object.keys(eMap);
		var finalObj = {};
		
		var typesToSend = ["Spatial", "Renderer", "RectRenderer"];
		
		for (var k =0; k < kys.length; k++){
			var nam = kys[k];
			if (eMap[nam]["Spatial"]){
				var spat = eMap[nam]["Spatial"];
				if ((  (spat.x - location.x) * (spat.x - location.x) + (spat.y - location.y) * (spat.y - location.y)  ) < 4000000){ //If our objec is within 2000 pixels
					if (!finalObj[nam]){
						finalObj[nam] = {};
					}

					for (var b = 0; b < typesToSend.length; b++){
						var nameOfType = typesToSend[b];
						
						if (eMap[nam][nameOfType]){
							finalObj[nam][nameOfType] = eMap[nam][nameOfType];
						}
					}
					
					if (nam == who){//If we are sending information to this particular entity,
						var nameOfType = "Input-Human";
						if (eMap[nam][nameOfType]){
							finalObj[nam][nameOfType] = eMap[nam][nameOfType];
						}
					}
				}
			}
		}
		
		return (JSON.stringify(finalObj));
}

var main = function () {
	var now = new Date();
	var delta = now - then;
	delta = delta/1000;

	for (var j = 0; j < SubSystems.length; j++){
		SubSystems[j].update(delta);	
	}

	var spawnRate = .06 + Math.floor(killCount / 20) * .1;
	if ((currentEnemyCount< Math.ceil(killCount/6)) && Math.random() < .06){
		Factory.CreateBadGuy();
	}
	
	for (var key in  socketMap){
		var strToSend = CreateEntityMap(EntityManager.entityMap, EntityManager.getComponent(socketMap[key], "Spatial"), socketMap[key]);
		io.sockets.socket(key).volatile.emit("EntityManager", strToSend);
	}
	
	then = now;
	//process.nextTick(main);
	setTimeout(main,10);
};


var SubMovement = new SubSystems.Movement(EntityManager);
var SubShipController = new SubSystems.ShipController(EntityManager);
var SubHumanInput = new SubSystems.HumanInput(EntityManager);
var SubArtificialInput = new SubSystems.ArtificialInput(EntityManager);
var SubDelete = new SubSystems.Deletetions(EntityManager);
var SubParticles = new SubSystems.Particles(EntityManager);
var SubCollisions = new SubSystems.Collisions(EntityManager);
var SubGuns = new SubSystems.Guns(EntityManager);
var SubPositions = new SubSystems.Spatial(EntityManager);


var SubSystems = [SubMovement, SubShipController, SubArtificialInput, SubParticles, SubDelete, SubCollisions, SubGuns, SubPositions];

GLOBAL.backThen = 0;
GLOBAL.killCount = 0;
GLOBAL.currentEnemyCount = 0;	
// global.ROCKET = "./images/Rocket-2.png";

//im.identify(ROCKET, function(err, features){
	//sizesMap[ROCKET] = {};
	//sizesMap[ROCKET].width = features.width;
	//sizesMap[ROCKET].height = features.height;
//});


var init = function(){
	then = new Date();
	backThen = new Date();
	for (var i = 0; i < 55; i++){
		Factory.CreateBadGuy(0 + Math.random() * 800,0 + Math.random()* 800);	
	}
	main();
}


init();