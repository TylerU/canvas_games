/////////////////////////////////////////////////////////////////////////////////
// TO DO (Client.js):
// - Convert accurate EntityMap to accurate ComponentMap
// - 
/////////////////////////////////////////////////////////////////////////////////

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
var killCount = 0;
var cheated = false;
var LevelCanvas;

var MAX_TIME_BETWEEN_COLLISIONS = 200;
var PLAYER_MAX_SPEED = 200;
var ENEMY_MAX_SPEED = 200;
var GOOD_TEAM = 10;
var timers = new Timers();

var AM = new AssetManager();
var TILES_IMAGE = "./images/Tiles.png";
var ACID_ANT_IMAGE = "./images/Poison_Ant.png";
var BATTLE_ANT_IMAGE = "./images/Battle_Ant.png";
var ACID_IMAGE = "./images/acid-1.png";
var ENEMY1_IMAGE = "./images/B.png";
var ENEMY1_DEAD_ACID_IMAGE = "./images/DB1.png";
var ENEMY1_DEAD_TRAMPLE_IMAGE = "./images/DB.png";

var PLACEWHEREFIRERATEIS = "GUN";
var FIRERATESNAME = "timeBetweenShots";

AM.queueDownload(TILES_IMAGE);
AM.queueDownload(ACID_ANT_IMAGE);
AM.queueDownload(ACID_IMAGE);
AM.queueDownload(ENEMY1_IMAGE);
AM.queueDownload(BATTLE_ANT_IMAGE);
AM.queueDownload(ENEMY1_DEAD_ACID_IMAGE);
AM.queueDownload(ENEMY1_DEAD_TRAMPLE_IMAGE);

var fleshlingCollision  = "flesh";
var wallCollision = "wall";
var bulletCollision = "bullet";

var memory = [];
var keysDown = {};

addEventListener("keydown", function (e) {	
	if (!keysDown[e.keyCode]){
		SubHumanInput.keyDown(e.keyCode);
	}
	
	if (e.keyCode == 13){
		switchCharacter();
	}
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) { 
	delete keysDown[e.keyCode];
	SubHumanInput.keyUp(e.keyCode);	
}, false);



function switchCharacter(){
	var ents = EntityManager.getAllEntitiesWith("CouldBeControlled");
	
	if (ents){
		var index;
				
		for (var i = 0; i< ents.length; i++){
			var ent = ents[i];
			if (EntityManager.getComponent(ent, "Input-Human")){
				index = i;
			}
		}
		
		var newcont = index+1;
		if (newcont == ents.length){
			newcont = 0;
		}
		
		var ent1 = ents[index];
		var ent = ents[newcont];
		
		EntityManager.removeComponent(ent1, "Input-Human");
		EntityManager.addComponent(ent1, new ArtificialInput(true, 300, 50));
		EntityManager.addComponent(ent, new HumanInput());
		EntityManager.removeComponent(ent, "ArtificialInput");
	}
}
function getCurrentPlayerName(){
	if (EntityManager.getAllEntitiesWith("Input-Human")){
		return EntityManager.getAllEntitiesWith("Input-Human")[0];
	}	
}

var quit = false;
var MAX_ENEMIES = 6;
var main = function () {
	var now = Date.now();
	var delta = now - then;
	delta = delta/1000;
	
	timers.update();
	
	
	var cap = .025;
	if (delta > cap ){
		delta = cap;
	}
	
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

	var playerThings = EntityManager.getAllEntitiesWith("CouldBeControlled");
	var entity1 = playerThings[0];
	var entity2 = playerThings[1];
	var where1is = EntityManager.getComponent(entity1, "Spatial");
	var where2is = EntityManager.getComponent(entity2, "Spatial");
	
	if (where1is.x > 2800 && where1is.y > 2800 && where2is.x > 2800 && where2is.y > 2800){
		alert("YOU WIN!!!");
		quit = true;
		window.location.reload(true);
	}	
	
	var playerPos = EntityManager.getComponent(getCurrentPlayerName(), "Spatial"); 
	ctx.save();
	ctx.translate(-playerPos.x + ctx.canvas.width/2, -playerPos.y + ctx.canvas.height/2);
		ctx.drawImage(LevelCanvas, 0,0);
	ctx.restore()
	
	//console.log(isCollidingWithWorld(playerPos.x, playerPos.y,playerPos.width, playerPos.height, level));
	for (var j = 0; j < SubSystems.length; j++){
		SubSystems[j].update(delta);	
	}
	
	ctx.save()
		ctx.translate(10, 20);
		ctx.fillStyle = "rgb(255,0,0)";		
		try {
			ctx.fillRect(0,0, 3 * EntityManager.getComponent(getCurrentPlayerName(), "Health").health, 4);
		}
		catch (e){
		
		}
	ctx.restore()
	
	if ((EntityManager.getAllEntitiesWith("ArtificialInput").length< MAX_ENEMIES) && Math.random() < .05){
		CreateBadGuy();
		//console.log("Enemy Created");
	}

	
	then = now;
	if (!quit)
		requestAnimFrame(main, canvas);
};


var SubRenderer = new SubSystemRender(EntityManager, ctx);
var SubMovement = new SubSystemMovement(EntityManager);
var SubShipController = new SubSystemShipController(EntityManager);
var SubHumanInput = new SubSystemHumanInput(EntityManager);
var SubArtificialInput = new SubSystemArtificialInput(EntityManager);
var SubCollisions = new SubSystemCollisions(EntityManager);
var SubGuns = new SubSystemGuns(EntityManager);
var SubPositions = new SubSystemSpatial(EntityManager);
var SubDeletions = new SubSystemDeletetions(EntityManager, ctx);

var SubSystems = [ SubRenderer, SubDeletions, SubShipController, SubArtificialInput, 
	 SubPositions, SubMovement, SubCollisions, SubGuns ];//ORDER IS IMPORTANT!


						
var init = function(){
	LevelCanvas = CreateLevelCanvas(level);
	var player1 = 	Factory.CreateBattleAnt();
	var other = Factory.CreateAcidAnt();
	resize();
    window.onresize = resize;

	then = Date.now();
	backThen = Date.now();
	for (var i = 0; i < MAX_ENEMIES; i++){
		CreateBadGuy();	
	}
	main();
}

function resize()
{
	ctx.canvas.width  = window.innerWidth; 
	ctx.canvas.height = window.innerHeight; 
}



var then = Date.now();
AM.downloadAll(init);

// Let's play this game!

//alert("Compiled Successfully");