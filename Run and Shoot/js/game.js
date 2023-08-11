var MAP_SIZE = 600;


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");


var UICanvas = document.createElement("canvas");
var BackGroundCanvas = document.createElement("canvas");

canvas.width = MAP_SIZE;
canvas.height = MAP_SIZE;
canvas.style.position = 'absolute';
canvas.style.left = '0px';
canvas.style.top = '0px';

UICanvas.width = MAP_SIZE;
UICanvas.height = MAP_SIZE;
UICanvas.style.position = 'absolute';
UICanvas.style.left = '0px';
UICanvas.style.top = '0px';

BackGroundCanvas.width = MAP_SIZE;
BackGroundCanvas.height = MAP_SIZE;
BackGroundCanvas.style.position = 'absolute';
BackGroundCanvas.style.left = '0px';
BackGroundCanvas.style.top = '0px';


document.body.appendChild(BackGroundCanvas);
document.body.appendChild(canvas);
document.body.appendChild(UICanvas);



var AM = new AssetManager();
var SM = new SoundManager();
var PLAY_SOUNDS = false;
// var PLAY_SOUNDS = true;
//var BG = new core.BackGround();
var TILES = "images/tiles.png";
var BOMB = "images/bomb.png";

var COIN_PICKUP = "sounds/coin_pickup.wav";
var ENEMY_DEATH = "sounds/enemy_death.wav";
var HURT = "sounds/hurt.wav";
var ENEMY_SHOOT = "sounds/enemy_shoot.wav";
var PLAYER_SHOOT = "sounds/player_shoot.wav";
var BACKGROUND_MUSIC = "sounds/controllers.mp3";
//var BACK = "images/background.png";

AM.queueDownload(BOMB);
AM.queueDownload(TILES);
// SM.queueDownload(COIN_PICKUP);
// SM.queueDownload(ENEMY_DEATH);
// SM.queueDownload(HURT);
// SM.queueDownload(ENEMY_SHOOT);
// SM.queueDownload(PLAYER_SHOOT);
// SM.queueDownload(BACKGROUND_MUSIC);


var FREE_UPGRADES = false;



var tLeft = new TouchStick(0,0);//Dummies
var tRight = new TouchStick(100,100);


function basicUpgradeCost(level){
	return 10 + Math.floor (.5 * (level-1) * (level-1));
}

var allUpgradeButtons = [
	new Button("Attack Speed", basicUpgradeCost, "Gun", "timeBetweenShots", -.01),
	new Button("Move Speed", basicUpgradeCost, "ShipController", "maxSpeed", 20),
	new Button("Accuracy", basicUpgradeCost, "Gun", "accuracy", .05),
	new Button("Range", basicUpgradeCost, "Gun", "range", 30),
	new Button("Max HP", basicUpgradeCost, "Health", "startHealth", 1),
	new Button("Damage", basicUpgradeCost, "Gun", "damage", .5),
	new Button("Armor", basicUpgradeCost, "Armor", "percent", .01)
];






// Handle keyboard controls
var keysDown = {};
var key_names = {
	38:"up",
	40:"down",
	37:"left",
	39:"right"
};

//Remap to WASD
key_names = {
	87:"up",
	83:"down",
	65:"left",
	68:"right",
	32:"pause"
};


//TO DO:
//Update to use key_names
function input_change(key, value){
	if(key_names[key] == "pause"){
		if(value){//Key up
			gamePaused = !gamePaused;
			if(gamePaused){
				PauseGame();
				UI.show();
			}
			else{
				UnPauseGame();
				UI.hide();				
			}
		}
	}

	if (value)
		SubHumanInput.keyDown(key);
	else
		SubHumanInput.keyUp(key);

	if (key in key_names){
		keysDown[key_names[key]] = value;
	}
}


addEventListener("keydown", function (e) {
	if (!keysDown[key_names[e.keyCode]]){
		input_change(e.keyCode, true);
	}
}, false);

addEventListener("keyup", function (e) {
	input_change(e.keyCode, false);
}, false);


addEventListener("mousedown", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
	if (!isRightMB){	
		if(!Modernizr.touch)
			SubHumanInput.mouseChange(true);
		UI.mouseChange(true, e.pageX, e.pageY);
	}
}, false);

addEventListener("mouseup", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        
    if (!isRightMB){
    	if(!Modernizr.touch)
    		SubHumanInput.mouseChange(false);
    	UI.mouseChange(false, e.pageX, e.pageY);
	}

}, false);


addEventListener("mousemove", function (e) {
    var isRightMB;
    e = e || window.event;


    if(!Modernizr.touch)
   		SubHumanInput.mouseMove(e);
    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
	if (!isRightMB){	

	}
}, false);



if(Modernizr.touch){
	function touchUpdate(){
		SubHumanInput.angleChange(tRight.getAngle());
		SubHumanInput.touchMoveChange(tLeft.getAngle());
	}

	addEventListener('touchstart', function(e){
		e.preventDefault();
		
		for(var i = 0; i < e.touches.length; i++){
			tLeft.touchUpdate(e.touches[i].pageX, e.touches[i].pageY);
			tRight.touchUpdate(e.touches[i].pageX, e.touches[i].pageY);
		}

		touchUpdate();
	}, true);

	addEventListener('touchmove', function(e){
		e.preventDefault();

		for(var i = 0; i < e.touches.length; i++){
			tLeft.touchUpdate(e.touches[i].pageX, e.touches[i].pageY);
			tRight.touchUpdate(e.touches[i].pageX, e.touches[i].pageY);
		}

		touchUpdate();
	}, true);

	addEventListener('touchend', function(e){
		e.preventDefault();
		

		// for(var i = 0; i < e.touches.length; i++){
			tLeft.touchEnd(0, 0);
			tRight.touchEnd(0, 0);
		// }

		touchUpdate();
	}, true);
}








//I DO NOT LIKE THIS
var SubRenderer = new SubSystems.SubSystemRender(EntityManager, ctx);
// var SubRectRenderer = new SubSystemRectRender(EntityManager, ctx);
var SubMovement = new SubSystems.SubSystemMovement(EntityManager);
var SubShipController = new SubSystems.SubSystemShipController(EntityManager);
var SubHumanInput = new SubSystems.SubSystemHumanInput(EntityManager);
var SubAIMovement = new SubSystems.SubSystemAIMovement(EntityManager);
// var SubAffected = new SubSystemAffectedByPlayer(EntityManager);
// var SubStarWrap = new SubSystemStarWrap(EntityManager);
var SubDelete = new SubSystems.SubSystemDeletetions(EntityManager, ctx);
// var SubParticles = new SubSystemParticles(EntityManager);
var SubCollisions = new SubSystems.SubSystemCollisions(EntityManager);
var SubGuns = new SubSystems.SubSystemGuns(EntityManager);
var SubPositions = new SubSystems.SubSystemSpatial(EntityManager);
var SubDistanceDeletetions = new SubSystems.SubSystemDistanceDeletetions(EntityManager);

var SubSystemLoseHealthOnHit = new SubSystems.SubSystemLoseHealthOnHit(EntityManager);
var SubSystemDamaging = new SubSystems.SubSystemDamaging(EntityManager);

var SubDropXP = new SubSystems.SubSystemDropXP(EntityManager);
var SubPickXP = new SubSystems.SubSystemPickUpXP(EntityManager);
// var SubSystems = [SubRectRenderer,SubRenderer, SubMovement, SubShipController, SubArtificialInput, SubAffected, SubStarWrap, SubDelete, SubParticles, SubCollisions, SubGuns, SubPositions];
var SubAttraction = new SubSystems.SubSystemAttractToHuman(EntityManager);
var SubScreenLeave = new SubSystems.SubSystemLeaveScreen(EntityManager, canvas);
var SubDropHealth = new SubSystems.SubSystemDropHealth(EntityManager);
var SubPickHealth = new SubSystems.SubSystemPickUpHealth(EntityManager);
var SubDeleteTime = new SubSystems.SubSystemDeleteAfterTime(EntityManager);
var SubExplosionsMaker = new SubSystems.SubSystemExplodeOnTimeDeletion(EntityManager);
var SubSizeIncreaser = new SubSystems.SubSystemSizeIncreaser(EntityManager);
var SubShake = new SubSystems.SubSystemShake(EntityManager);

var KillCounter = new SubSystems.SubSystemEnemyDeath(EntityManager);
var restarter = new SubSystems.SubSystemHumanDeath(EntityManager);

var SubSystems = [SubAIMovement, SubShipController, SubGuns, SubMovement, SubShake, SubScreenLeave, SubAttraction, SubRenderer, SubPositions, SubSizeIncreaser, SubCollisions, SubDelete, SubDistanceDeletetions, SubDeleteTime];


var highKills = 1;


/*
find a better solution for this... :(
*/
var EnemySpawnManager = {
	killCount : 0,
	wave : 1,
	waiting: false,

	enemyDeath : function(){
		this.killCount++;
		SM.play(ENEMY_DEATH);
	},

	checkStatus: function(){
		if(EntityManager.getAllEntitiesWith("Enemy").length == 0 && !this.waiting){
			this.waiting = true;
			this.wave++;

			if(this.wave > highKills){
				highKills = this.wave;
			}
			setTimeout(this.spawnStartWave, 3000);
		}
	},

	restart: function(){
		this.wave = 1;
		this.spawnStartWave();
	},

	spawnStartWave: function(){
		var w = EnemySpawnManager.wave;
		EnemySpawnManager.waiting = false;

		if(w % 5 !== 0){
			var numNormal = 2 + Math.floor((w - 1) * 1.0);
			for(var i = 0; i < numNormal; i++){
				Factory.CreateBadGuy();
			}

			if(w > 7){
				var numFast = 1 + Math.floor((w - 7) * .4);
				for(var i = 0; i < numFast; i++){
					Factory.CreateFastGuy();
				}
			}

			if(w > 8){
				var numBig = 1 + Math.floor((w - 8) * .1);
				for(var i = 0; i < numBig; i++){
					Factory.CreateBigBadGuy();
				}
			}

			if(w > 10){
				var numBombers = 1 + Math.floor((w - 10) * .1);
				for(var i = 0; i < numBig; i++){
					Factory.CreateBomberGuy();
				}				
			}
		}
		else{
			switch(w){
				case 5:
					Factory.CreateBigBadGuy();
					break;
				case 10:
					Factory.CreateBomberGuy();
					break;
				default:
					Factory.CreateBigBadGuy();
					break;
			}
			
		}
	}
}

function RestartGame(){
	EnemySpawnManager.killCount = 0;
	EntityManager.reset();
	Factory.CreatePlayer();
	EnemySpawnManager.restart();
	UI.resetLevels();
	UI.draw();
}

function getPlayer(){
	var arr = EntityManager.getAllEntitiesWith("Input-Human");

	if(arr)
		return arr[0];
	else
		return null;
}

var gamePaused = false;

function PauseGame(){
	gamePaused = true;
}

function UnPauseGame(){
	gamePaused = false;
}


var showReminder = true;

function drawGameUI(myCtx){
	var player = getPlayer();
	if(player){

		//Health Bar
		var hpObj = EntityManager.getComponent(player, "Health");
		var startX = 10;
		var startY = 10;
		var height = 10;
		var width = hpObj.health / hpObj.startHealth * (hpObj.startHealth * 10);
		var totalW = (hpObj.startHealth * 10);
		myCtx.fillStyle = "rgb(200,0,0)";
		myCtx.fillRect(startX,startY, totalW,height);
		myCtx.fillStyle = "rgb(255,0,0)";
		myCtx.fillRect(startX,startY, width,height);

		//XP
		myCtx.fillStyle = "rgb(0,0,0)";
		myCtx.font = "bold 30px Calibri";
		startX = 10;
		startY = 50;
		myCtx.fillText("XP: " + EntityManager.getComponent(player, "XPContainer").xp , startX, startY);

		//Kills
		myCtx.fillStyle = "rgb(0,0,0)";
		myCtx.font = "bold 30px Calibri";
		startX = 10;
		startY = 80;
		myCtx.fillText("Kill Count: " + EnemySpawnManager.killCount, startX, startY);

		//High Score
		myCtx.fillStyle = "rgb(0,0,0)";
		myCtx.font = "bold 30px Calibri";
		startX = 200;
		startY = 50;
		myCtx.fillText("Wave Record: " + highKills, startX, startY);		

		//wave
		myCtx.fillStyle = "rgb(0,0,0)";
		myCtx.font = "bold 30px Calibri";
		startX = 200;
		startY = 80;
		myCtx.fillText("Wave: " + EnemySpawnManager.wave, startX, startY);	

		if(showReminder){
			startX = canvas.width/4;
			startY = canvas.height * 4/5;
			myCtx.fillText("Move: WASD", startX, startY);
			startY += 30;

			myCtx.fillText("Shoot: Mouse", startX, startY);
			startY += 30;	
			myCtx.fillText("Shop/Upgrade: SPACEBAR" , startX, startY);	
		}
	}
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
		
	//update(delta / 1000);

	//render();

	ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
	ctx.canvas.width = ctx.canvas.width;
	ctx.canvas.height = ctx.canvas.height;
	if(!gamePaused){
		// delta = delta / 2;

		for (var j = 0; j < SubSystems.length; j++){
			SubSystems[j].update(delta / 1000);	
		}

		if(!getPlayer()){
			RestartGame();
		}

		if(Modernizr.touch){
			tLeft.draw();
			tRight.draw();
		}

		EnemySpawnManager.checkStatus();
		
	}
	
	drawGameUI(ctx);
	

	then = now;
	requestAnimFrame(main, canvas);
};


var init = function(){		
	window.onresize = resize;	
	UI.init(UICanvas, allUpgradeButtons);
	resize();
	

	then = Date.now();
	
	Factory.CreatePlayer();
	EnemySpawnManager.spawnStartWave();




	if(PLAY_SOUNDS){
		SM.cache[BACKGROUND_MUSIC].loop = true;
		SM.cache[BACKGROUND_MUSIC].volume = 1.0;
		SM.cache[BACKGROUND_MUSIC].play();
	}

	setTimeout(function(){
		showReminder=  false;
	}, 5000)
	main();
}


function drawBackGround(){
	var size = 16;
	var backCtx =  BackGroundCanvas.getContext("2d");
	var asset = AM.getAsset(TILES);

	for(var i = 0; i < Math.ceil(canvas.width/size); i++){
		for(var j = 0; j < Math.ceil(canvas.height/size); j++){
			backCtx.drawImage(asset, 0, 0, size, size, i*size, j*size, size, size);//Draws at the image's size, not at the given size
		}
	}
}


function resize()
{
	var newW;
	var newH;

	if(Modernizr.touch){
		newW = window.innerWidth;
		newH = window.innerHeight;

		var offset = 100;
		tLeft = new TouchStick(offset, newH - offset);
		tRight = new TouchStick(newW - offset, newH - offset);
	}
	else{
		MAP_SIZE = window.innerHeight.clamp(600, 800);
		newW = MAP_SIZE;
		newH = MAP_SIZE;
	}

	canvas.width = newW;
	canvas.height = newH;


	UICanvas.width = newW;
	UICanvas.height = newH;


	BackGroundCanvas.width = newW;
	BackGroundCanvas.height = newH;
	drawBackGround();
	UI.refreshSize()
	UI.draw();
}



var then = Date.now();
SM.downloadAll(AM.downloadAll(init));
// Let's play this game!
