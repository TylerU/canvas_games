 // Create the canvas
/*
require("js/Vector.js")
require("js/Timer.js")      
require("js/Components.js")
require("js/SubSystems.js")
require("js/EntityManager.js")
require("js/Factory.js")*/

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
})();

var currentEnemyCount = 0;

var playerStyle = "rgb(0,0,170)";
var cheated = false;

var AM = new AssetManager();
var ROCKET = "images/Rocket-2.png";

var PLACEWHEREFIRERATEIS = "GUN";
var FIRERATESNAME = "timeBetweenShots";

AM.queueDownload(ROCKET);


//var keysDown = {};
var memory = [];
addEventListener("keydown", function (e) {
	//keysDown[e.keyCode] = true;
	if (memory.unshift(String.fromCharCode(e.keyCode)) > 10){
		memory.pop();
	}
	
	if (CheckCheatCode("SARAH")){
		playerStyle = "rgb(255,105,180)";
	}
	else if (CheckCheatCode("LUCAS")){
		playerStyle = "rgb(34,139,34)";
	}
	else if (CheckCheatCode("FREEHEALTH")){
		cheated = true;
		player.getComponent("Health").health = 1000;	
	}
	else if(CheckCheatCode("SKYLER")){
		cheated= true;
		var arr = EntityManager.getAllEntitiesWith("ArtificialInput");
		var len = arr.length+11-11;
		killCount += len;
		
		for(var j = 0; j < len; j++){
			EntityManager.removeEntity(arr[0]);
		}
	}
	SubHumanInput.keyDown(e.keyCode);
}, false);

addEventListener("keyup", function (e) {
	//delete keysDown[e.keyCode];
	SubHumanInput.keyUp(e.keyCode);	
}, false);


function CheckCheatCode(code){
	var newStr = memory.slice(0,code.length);
	newStr = newStr.reverse();
	newStr = newStr.toString();
	newStr = newStr.replace(/,/g,'');
	if (newStr == code)
		return true;
	else
		return false;
}



function getCurrentPlayerName(){
	if (EntityManager.getAllEntitiesWith("Input-Human")){
		return EntityManager.getAllEntitiesWith("Input-Human")[0];
	}	
}
var main = function () {
	var now = Date.now();
	var delta = now - then;
	delta = delta/1000;
	
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

	
	ctx.save()
		ctx.translate(10, 20);
		ctx.fillStyle = "rgb(255,0,0)";		
		ctx.fillRect(0,0, 3 * EntityManager.getComponent(getCurrentPlayerName(), "Health").health, 4);
	ctx.restore()
	
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


var SubRenderer = new SubSystemRender(EntityManager, ctx);
var SubRectRenderer = new SubSystemRectRender(EntityManager, ctx);
var SubMovement = new SubSystemMovement(EntityManager);
var SubShipController = new SubSystemShipController(EntityManager);
var SubHumanInput = new SubSystemHumanInput(EntityManager);
var SubArtificialInput = new SubSystemArtificialInput(EntityManager);
var SubAffected = new SubSystemAffectedByPlayer(EntityManager);
var SubStarWrap = new SubSystemStarWrap(EntityManager);
var SubDelete = new SubSystemDeletetions(EntityManager, ctx);
var SubParticles = new SubSystemParticles(EntityManager);
var SubCollisions = new SubSystemCollisions(EntityManager);
var SubGuns = new SubSystemGuns(EntityManager);
var SubPositions = new SubSystemSpatial(EntityManager);


var SubSystems = [SubRectRenderer,SubRenderer, SubMovement, SubShipController, SubArtificialInput, SubAffected, SubStarWrap, SubDelete, SubParticles, SubCollisions, SubGuns, SubPositions];

//EntityManager.getComponent(player.name, "PowerUpManager").addPowerUp(player.name, new PowerUp("ShipController", [{what:"maxSpeed", setTo: 1000}]));
//EntityManager.getComponent(player.name, "PowerUpManager").addPowerUp(player.name, new PowerUp("ShipController", [{what:"acc", setTo: 100}]));

var backThen = 0;
var killCount = 0;
						
var init = function(){
	var player1 = 	new Entity(	EntityManager, [new Spatial(400,400), new Movement(100,0, false), new HumanInput(),
					new ShipController(null, 10), new Renderer(ROCKET, 1,1)	, new Health(30), new Collider(fleshlingCollision), new Gun(false, "Basic"),
			    	new PowerUpManager()]);

	
	resize();
    window.onresize = resize;

	then = Date.now();
	backThen = Date.now();
	for (var i = 3; i < 5; i++){
		CreateBadGuy();	
	}
	main();
}

function resize()
{
	ctx.canvas.width  = window.innerWidth; 
	ctx.canvas.height = window.innerHeight; 
	EntityManager.getComponent(getCurrentPlayerName(), "Spatial").x = ctx.canvas.width/2;
	EntityManager.getComponent(getCurrentPlayerName(), "Spatial").y = ctx.canvas.height/2;
	createStars();
}



function createStars(){
	var allStars = EntityManager.getAllEntitiesWith("StarWrap");
	if (allStars){
		for (var i = 0; i < allStars.length; i++){
			EntityManager.removeEntity(allStars[i]);	
		}
	}

	var numStars = Math.floor((ctx.canvas.width * ctx.canvas.height) / 60000) ;
	var levels = 5; 
	
	for (var a = 1; a <= levels; a++){
		for (var i = 0; i < numStars; i++){
			var star = new Entity(	EntityManager, [new Spatial(Math.random() * canvas.width,Math.random() * canvas.height), new RectRenderer({r:255,g:255,b:255},Math.ceil(a/2) ) , new AffectedByPlayerMovement(levels-.5-a/2), new StarWrap() ]);
		}
	}
}


var then = Date.now();
AM.downloadAll(init);

// Let's play this game!

//alert("Compiled Successfully");