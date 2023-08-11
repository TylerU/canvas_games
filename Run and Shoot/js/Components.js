var GameComponents = {};





GameComponents.Spatial = function(x1, y1, ro, wid, hei){
	if (x1)
		this.x=x1;
	else
		this.x=0;

	if (y1)
		this.y=y1;
	else
		this.y=0;
	
	if (ro)
		this.rot=ro;
	else
		this.rot=0;

	if (wid)
		this.width=wid;
	else
		this.width=0;

	if (hei)
		this.height=hei;
	else
		this.height=0;
}
GameComponents.Spatial.prototype.name = "Spatial";




GameComponents.Health = function(startHeal){
	this.health = startHeal; 
	this.startHealth = startHeal;
}
GameComponents.Health.prototype.name = "Health";





 GameComponents.Damager = function(amount){
	if (amount)
		this.damage = amount; 
	else
		this.damage = 1;
}
GameComponents.Damager.prototype.name = "Damager";




 GameComponents.Renderer = function(infoObj){
	try{
		for(var key in infoObj){
			this[key] = infoObj[key];
		}
	}
	catch (timeshifters){
		console.log("Problem in Renderer");
		//ThrowThemIntoTheShiftTimerLands(timeShifters)
	}	
}
GameComponents.Renderer.prototype.name = "Renderer";





 GameComponents.DeleteWhenOffScreen = function(d){
	this.dist = d;
}
GameComponents.DeleteWhenOffScreen.prototype.name = "DeleteWhenOffScreen";





 GameComponents.DeleteAfterTraveledDist = function(d){
	this.dist = d;
	this.startPos = null;
}
GameComponents.DeleteAfterTraveledDist.prototype.name = "DeleteAfterTraveledDist";




 GameComponents.ConnectedEntity = function(who){
	this.conn = who;
}
GameComponents.ConnectedEntity.prototype.name = "ConnectedEntity";




GameComponents.StarWrap = function(){
}
GameComponents.StarWrap.prototype.name = "StarWrap";







 GameComponents.AffectedByPlayerMovement = function(div){
	if (div)
		this.d = div;
	else
		this.d = 1;
}
GameComponents.AffectedByPlayerMovement.prototype.name = "AffectedByPlayerMovement";




 GameComponents.ParticleController = function(initspeed){
	this.initSpeed = initspeed;
}
GameComponents.ParticleController.prototype.name = "ParticleController";




 GameComponents.ShipController = function(maxSp, t){
	this.dirFacing = 0;

	if (maxSp)
		this.maxSpeed = maxSp;
	else
		this.maxSpeed = 500;
		
	this.dRot = 6.1;

	if (t)
		this.team = t;
	else
		this.team = 1;
			
	//Physics
	this.acc = 20;
	this.airRes = this.acc/4;
}

GameComponents.ShipController.prototype.name = "ShipController";




 GameComponents.Movement = function(x,y, app, dec){
	this.apply = app;
	
	if (this.apply == null){
		this.apply = true;	
	}
	
	this.vec  = new Vec2(x,y);
	if(dec)
		this.dec = dec;
	else
		this.dec = -1;

	this.origDec = this.dec;
}
GameComponents.Movement.prototype.name = "Movement";





 GameComponents.Collider = function(channel){
	this.channel = channel;
}
GameComponents.Collider.prototype.name = "Collider";





 GameComponents.HumanInput = function(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.down = false;

	this.angle = 0;
	this.shoot = false;
}

GameComponents.HumanInput.prototype.name = "Input-Human";




 GameComponents.InputAndAIMovement = function(){
	this.directionClockwise = true;
	this.speed = 100;
	this.orbitDist = 100;

	this.timeSinceLastChange = 0;
	this.timeBetweenChangesBase = 1;
	this.timeBetweenChangesVariable = 2;
}

GameComponents.InputAndAIMovement.prototype.name = "InputAndAIMovement";




 GameComponents.Gun = function(dist, name, time, acc, rng, dmg){
	if(acc)
		this.accuracy = acc;
	else
		this.accuracy = 1;

	if(rng)
		this.range = rng;
	else
		this.range = 300;

	if (dist)
		this.offSet = dist;
	else
		this.offSet = 10;
	
	if (dmg)
		this.damage = dmg;
	else
		this.damage = 1;

	if (time)
		this.timeBetweenShots = time;
	else
		this.timeBetweenShots = .45;
	
	this.timeSinceLastShot =  Math.random() / this.timeBetweenShots;

	if (name)
		this.type = name;
	else
		this.type = "Basic";
}


GameComponents.Gun.prototype.name = "Gun";


GameComponents.XPDropper = function(howMany){
	this.howMany = howMany;
}
GameComponents.XPDropper.prototype.name = "XPDropper";



GameComponents.XPContainer = function(){
	this.xp = 0;
}
GameComponents.XPContainer.prototype.name = "XPContainer";



GameComponents.XPGiver = function(howMuch){
	this.howMuch = howMuch;
}
GameComponents.XPGiver.prototype.name = "XPGiver";



GameComponents.AttractedToHuman = function(dist, maxSpeed){
	if(dist)
		this.dist = dist;
	else
		this.dist = 50;

	// if(acc)
	// 	this.acc = acc;
	// else
	// 	this.acc = 100;

	// this.minSpeed = 1000;

	if(maxSpeed)
		this.maxSpeed = maxSpeed;
	else
		this.maxSpeed = 500;
}
GameComponents.AttractedToHuman.prototype.name = "AttractedToHuman";


GameComponents.CantLeaveScreen = function(){}
GameComponents.CantLeaveScreen.prototype.name = "CantLeaveScreen";


GameComponents.HealthDropper = function(howMany){
	this.howMany = howMany;
}
GameComponents.HealthDropper.prototype.name = "HealthDropper";



GameComponents.HealthGiver = function(howMuch){
	this.howMuch = howMuch;
}
GameComponents.HealthGiver.prototype.name = "HealthGiver";


GameComponents.Armor = function(percentToBlock){
	this.percent = percentToBlock;
}
GameComponents.Armor.prototype.name = "Armor";


GameComponents.DeleteAfterTime = function(time){
	this.timeLeft = time;
}
GameComponents.DeleteAfterTime.prototype.name = "DeleteAfterTime";


GameComponents.Enemy = function(){
}
GameComponents.Enemy.prototype.name = "Enemy";


GameComponents.ExplodeOnTimeDeletion = function(){
}
GameComponents.ExplodeOnTimeDeletion.prototype.name = "ExplodeOnTimeDeletion";



GameComponents.SizeIncreaser = function(amnt){
	if(amnt)
		this.amount = amnt;
	else
		this.amount = 200;
}
GameComponents.SizeIncreaser.prototype.name = "SizeIncreaser";


GameComponents.Shake = function(amnt){
	this.velocity = Math.PI/100;
	
	this.minRot = -Math.PI/4;
	this.maxRot = Math.PI/4;
}
GameComponents.Shake.prototype.name = "Shake";


try{
	module.exports = GameComponents;
}
catch (e){
	// do nothing
}