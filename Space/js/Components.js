

Spatial.prototype.name = "Spatial";

function Spatial(x1, y1, ro, wid, hei){
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


Health.prototype.name = "Health";

function Health(startHeal){
	this.health = startHeal; 
	this.startHealth = startHeal;
}


Damager.prototype.name = "Damager";

function Damager(amount, exc){
	if (amount)
		this.damage = amount; 
	else
		this.damage = 1;
		
	if (exc)
		this.exception = exc; 
}

Renderer.prototype.name = "Renderer";

function Renderer(img, sx, sy){
	this.image = img;
	
	var nImg = AM.getAsset(img);
	
	if (nImg){
		this.width = nImg.width;
		this.height = nImg.height;
	}
	
	this.myCanvas = document.createElement('canvas');
	var thisCtx = this.myCanvas.getContext('2d');

	var image1 = AM.getAsset(img);

	var size = Math.sqrt(image1.width * image1.width  + image1.height * image1.height);

	this.myCanvas.width = size;
	this.myCanvas.height = size;

	this.sizeX = sx;
	this.sizeY = sy;
}

DeleteWhenOffScreen.prototype.name = "DeleteWhenOffScreen";

function DeleteWhenOffScreen(d){
	this.dist = d;
}


ConnectedEntity.prototype.name = "ConnectedEntity";

function ConnectedEntity(who){
	this.conn = who;
}


StarWrap.prototype.name = "StarWrap";

function StarWrap(){
}


PowerUpHolder.prototype.name = "PowerUpHolder";

function PowerUpHolder(pwup){
	this.pwUp = pwup;
}


RectRenderer.prototype.name = "RectRenderer";

function RectRenderer(c,w,h){
	this.color = "rgb("+c.r+","+c.g+","+c.b+")";
	this.width = w;
	if (h)
		this.height = h;
	else
		this.height = w;
}

AffectedByPlayerMovement.prototype.name = "AffectedByPlayerMovement";

function AffectedByPlayerMovement(div){
	if (div)
		this.d = div;
	else
		this.d = 1;
}

ParticleController.prototype.name = "ParticleController";

function ParticleController(initspeed){
	this.initSpeed = initspeed;
}


ShipController.prototype.name = "ShipController";

function ShipController(maxSp, t){
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

Movement.prototype.name = "Movement";

function Movement(x,y, app){
	this.apply = app;
	
	if (this.apply == null){
		this.apply = true;	
	}
	
	this.vec  = new Vec2(x,y);
}

Collider.prototype.name = "Collider";


var bulletCollision = "Bullet";
var fleshlingCollision = "Fleshling";
var powerUpCollision = "PowerUpCol"

function Collider(t, c){//Can be: Bullet, Fleshling
	this.type = t;
	if(c)
		this.channel = c;
	else
		this.channel = 1;
}



HumanInput.prototype.name = "Input-Human";

function HumanInput(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;
}


ArtificialInput.prototype.name = "ArtificialInput";


function ArtificialInput(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;	
}



Gun.prototype.name = "Gun";

function Gun(dist, name, time){
	if (dist)
		this.offSet = dist;
	else
		this.offSet = 40;
		
	this.timeSinceLastShot = 1000000;
	if (time)
		this.timeBetweenShots = time;
	else
		this.timeBetweenShots = .45;
	if (name)
		this.type = name;
	else
		this.type = "Basic";
}

PowerUpManager.prototype.name = "PowerUpManager";


function PowerUpManager(){
	this.currentPowerUps = [];
	this.addPowerUp = function(myOwner, powerUpObj){
		
		var comp = EntityManager.getComponent(myOwner, powerUpObj.location);
		if (comp){
			for (var i = 0; i < powerUpObj.values.length; i++){
				var toEdit = comp[powerUpObj.values[i].what];
				var toSet = powerUpObj.values[i].setTo;
				if (toEdit && toSet){
					if (toSet.constructor == String){
						powerUpObj.steakSauce = toEdit; 
						comp[powerUpObj.values[i].what] = toSet;
					}
					else if (toSet.constructor == Number){
						comp[powerUpObj.values[i].what] += toSet; 
					}
					else{
						alert("What am I supposed to do with this?");	
					}
				}
			}
		}
		this.currentPowerUps.push(powerUpObj);
	}
	
	
	this.removePowerUp = function(myOwner, powerUpName){
		var toRemove;
	
		for (var i = 0; i < this.currentPowerUps.length; i++){
			if (this.currentPowerUps[i].name == powerUpName){
				toRemove = this.currentPowerUps[i];
			}
		}
		
		var comp = EntityManager.getComponent(myOwner, toRemove.location);
		if (comp){
			for (var i = 0; i < toRemove.values.length; i++){
				var toEdit = comp[toRemove.values[i].what];
				var toSet = toRemove.values[i].setTo;
				if (toEdit && toSet){
					if (toSet.constructor == String){
						comp[toRemove.values[i].what] = toRemove.steakSauce;
					}
					else if (toSet.constructor == Number){
						comp[toRemove.values[i].what] -= toSet; 
					}
					else{
						alert("What am I supposed to do with this?");	
					}
				}
			}
		}
		
		
		for (var i = 0; i < this.currentPowerUps.length; i++){
			if (this.currentPowerUps[i].name == powerUpName){
				this.currentPowerUps.splice(i,1);	
			}
		}
	}
}






//Not a Component

var lastpwupnum = 0;
function PowerUp(loc, valsObj){
	this.location =  loc;
	this.values = valsObj;
	this.name = "p_" + lastpwupnum; 
	lastpwupnum++;
}


var powerUps = [
	new PowerUp("Health", [{what:"health", setTo:5}]),
	new PowerUp("Health", [{what:"health", setTo:7}]),
	new PowerUp("Health", [{what:"health", setTo:10}]),
	new PowerUp("Gun", [{what:"type", setTo:"Double"}]),
	new PowerUp("Gun", [{what:"timeBetweenShots", setTo:-.02}]),	
	new PowerUp("Gun", [{what:"type", setTo:"Spread"}]),
	new PowerUp("Gun", [{what:"timeBetweenShots", setTo:-.05}]),	
];
