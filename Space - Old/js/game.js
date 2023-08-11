 // Create the canvas
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


function CreatePowerUp(x, y, pwup){
	var color = {r:0, g:0, b:0};
	
	if (pwup.location == "Health")
		color.g = 255;
	else if (pwup.location == "Gun"){
		color.r = 255;
		if (pwup.values[0].what == "type"){
			color.b = 255; 	
		}
		if (pwup.values[0].what == "timeBetweenShots"){
			color.g = 255; 	
		}
	}
	else if (pwup.location == "ShipController"){
		color.b = 255;
	}
	else
	{
		color = {r:255, g:255, b:255};
	}
	new Entity(EntityManager, [
		new Spatial(x,y),
		new RectRenderer(color, 50, 50),
		new AffectedByPlayerMovement(1),
		new PowerUpHolder(pwup),
		new Collider(powerUpCollision)
	]);
}



function CreateParticle(color, direction, speed, x, y, size){
	/*new Entity(EntityManager, [
		new Spatial(x,y),
		new Movement(Math.cos(direction) * speed, Math.sin(direction) * speed),
		new RectRenderer(color, 0, size),
		new AffectedByPlayerMovement(1),
		new ParticleController(speed)
	]);*/
}

function CreateBadGuy(){
	currentEnemyCount++;
	var x = 0;
	var y = 0;
	if (Math.random() < .5){
		x = -500 + Math.random() * 300;
	}
	else{
		x = canvas.width + 200 + Math.random() * 300;
	}

	if (Math.random() < .5){
		y = -500 + Math.random() * 300;
	}
	else{
		y = canvas.height + 200 + Math.random() * 300;
	}
		
	 var a = new Entity(	EntityManager, [new Spatial(x,y), new Renderer(ROCKET,2,2) , new AffectedByPlayerMovement(1), new ShipController(400), new ArtificialInput(), new Movement(1,0), new Collider(fleshlingCollision), new Health(2), new DeleteWhenOffScreen(1000), new Gun(false, false, 1), new PowerUpManager()]);
	
	if (killCount > -1) {
		var numPowers = Math.ceil(Math.random() * killCount / 10);
		for (var i = 0; i < numPowers; i++){
			if (Math.random()  < 1){
				var num = Math.floor(Math.random() * powerUps.length);
				EntityManager.getComponent(a.name, "PowerUpManager").addPowerUp(a.name, powerUps[num]);
			}
		}
	}
}


function CreateBasicBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	new Entity(EntityManager, [
		new Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who),
	]);
}

function CreateKillerBullet(who, x, y, dist, rot, speed){
	var bullSpeed =  speed + 100;
	new Entity(EntityManager, [
		new Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who),
		new ArtificialInput(),
		new ShipController(false, 10), 
		new Gun(false, false, 1)		
	]);
}


function CreateDoubleBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	
	var angleDif = Math.PI / 18;
	var angle1 = rot + angleDif;
	var angle2 = rot - angleDif;
	
	new Entity(EntityManager, [
		new Spatial(x + Math.cos(angle1) * dist,y + Math.sin(angle1) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);

	new Entity(EntityManager, [
		new Spatial(x + Math.cos(angle2) * dist,y + Math.sin(angle2) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);

}


function CreateSpreadBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	
	var angleDif = Math.PI / 18;
	var angle1 = rot + angleDif;
	var angle2 = rot - angleDif;
	
	new Entity(EntityManager, [
		new Spatial(x + Math.cos(angle1) * dist,y + Math.sin(angle1) * dist, rot),
		new Movement(Math.cos(angle1) * bullSpeed, Math.sin(angle1) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);

	new Entity(EntityManager, [
		new Spatial(x + Math.cos(angle2) * dist,y + Math.sin(angle2) * dist, rot),
		new Movement(Math.cos(angle2) * bullSpeed, Math.sin(angle2) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);

	new Entity(EntityManager, [
		new Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new RectRenderer({r:255,g:0,b:0}, 20, 3),
		new DeleteWhenOffScreen(100),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);

}





Component.prototype.constructor = Component;
function Component(){
	this.name = "BaseComponent";
}

Component.prototype.GetName = function(){
	return this.name;	//Name set by the individual constructor functions
}

Component.prototype.GetOwner = function(){
	
}




Spatial.prototype = new Component(null);
Spatial.prototype.constructor = Spatial;
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



Health.prototype = new Component(null);
Health.prototype.constructor = Health;
Health.prototype.name = "Health";

function Health(startHeal){
	this.health = startHeal; 
	this.startHealth = startHeal;
}


Damager.prototype = new Component(null);
Damager.prototype.constructor = Damager;
Damager.prototype.name = "Damager";

function Damager(amount, exc){
	if (amount)
		this.damage = amount; 
	else
		this.damage = 1;
		
	if (exc)
		this.exception = exc; 
}


Renderer.prototype = new Component(null);
Renderer.prototype.constructor = Renderer;
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

DeleteWhenOffScreen.prototype = new Component(null);
DeleteWhenOffScreen.prototype.constructor = DeleteWhenOffScreen;
DeleteWhenOffScreen.prototype.name = "DeleteWhenOffScreen";

function DeleteWhenOffScreen(d){
	this.dist = d;
}


ConnectedEntity.prototype = new Component(null);
ConnectedEntity.prototype.constructor = ConnectedEntity;
ConnectedEntity.prototype.name = "ConnectedEntity";

function ConnectedEntity(who){
	this.conn = who;
}



StarWrap.prototype = new Component(null);
StarWrap.prototype.constructor = StarWrap;
StarWrap.prototype.name = "StarWrap";

function StarWrap(){
}


PowerUpHolder.prototype = new Component(null);
PowerUpHolder.prototype.constructor = PowerUpHolder;
PowerUpHolder.prototype.name = "PowerUpHolder";

function PowerUpHolder(pwup){
	this.pwUp = pwup;
}



RectRenderer.prototype = new Component(null);
RectRenderer.prototype.constructor = RectRenderer;
RectRenderer.prototype.name = "RectRenderer";

function RectRenderer(c,w,h){
	this.color = "rgb("+c.r+","+c.g+","+c.b+")";
	this.width = w;
	if (h)
		this.height = h;
	else
		this.height = w;
}

AffectedByPlayerMovement.prototype = new Component(null);
AffectedByPlayerMovement.prototype.constructor = AffectedByPlayerMovement;
AffectedByPlayerMovement.prototype.name = "AffectedByPlayerMovement";

function AffectedByPlayerMovement(div){
	if (div)
		this.d = div;
	else
		this.d = 1;
}

ParticleController.prototype = new Component(null);
ParticleController.prototype.constructor = ParticleController;
ParticleController.prototype.name = "ParticleController";

function ParticleController(initspeed){
	this.initSpeed = initspeed;
}


ShipController.prototype = new Component(null);
ShipController.prototype.constructor = ShipController;
ShipController.prototype.name = "ShipController";

function ShipController(maxSp, t){
	this.dirFacing = 0;

	if (maxSp)
		this.maxSpeed = maxSp;
	else
		this.maxSpeed = 500;
		
	this.dRot = .11;

	if (t)
		this.team = t;
	else
		this.team = 1;
			
	//Physics
	this.acc = 20;
	this.airRes = this.acc/4;
}

Movement.prototype = new Component(null);
Movement.prototype.constructor = Movement;
Movement.prototype.name = "Movement";

function Movement(x,y, app){
	this.apply = app;
	
	if (this.apply == null){
		this.apply = true;	
	}
	
	this.vec  = new Vec2(x,y);
}

Collider.prototype = new Component(null);
Collider.prototype.constructor = Collider;
Collider.prototype.name = "Collider";


var bulletCollision = "Bullet";
var fleshlingCollision = "Fleshling";
var powerUpCollision = "PowerUpCol"

function Collider(t){//Can be: Bullet, Fleshling
	this.type = t;
}



HumanInput.prototype = new Component(null);
HumanInput.prototype.constructor = HumanInput;
HumanInput.prototype.name = "Input-Human";

function HumanInput(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;
}


ArtificialInput.prototype = new Component(null);
ArtificialInput.prototype.constructor = ArtificialInput;
ArtificialInput.prototype.name = "ArtificialInput";


function ArtificialInput(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;	
}



Gun.prototype = new Component(null);
Gun.prototype.constructor = Gun;
Gun.prototype.name = "Gun";

function Gun(dist, name, time){
	if (dist)
		this.offSet = dist;
	else
		this.offSet = 60;
		
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

PowerUpManager.prototype = new Component(null);
PowerUpManager.prototype.constructor = PowerUpManager;
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


var EntityManager = 
{
	lastID: 0,
	entityMap: {}, // [ENTITY NAME][component name] = actual component
	componentMap: {}, //[Component Names][entities with this]
	
	getNextID: function(){
		this.lastID ++;
		return this.lastID;	
	},

	createEntity: function(){
		var id = "e_" + this.getNextID();
		this.entityMap[id] = {};
		return id;
	},
	
	addComponent: function(ent, component){
		this.entityMap[ent][component.name] = component;
		
		if (!this.componentMap[component.name]){
			this.componentMap[component.name] = [];	
		}
		this.componentMap[component.name].push(ent);
	},
	
	hasComponent: function(ent, comp){	
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		
		if (this.entityMap[entity][comp]){
			return true;	
		}
		else {
			return false;	
		}
	},
	
	
	getAllEntitiesWith: function(comp){
		return this.componentMap[comp];
	},
	
	
	getComponent: function(ent, comp){
		if (ent.constructor == String){
			return this.entityMap[ent][comp];
		}
		else{
			return this.entityMap[ent.name][comp];
		}
	},
	
	getComponentStartsWith: function(ent,comp){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		var keys = 	Object.keys(this.entityMap[entity]);
		var arr = this.entityMap[entity];
		for (var i = 0; i < keys.length; i++){
			if (keys[i].indexOf(comp) != -1 ){
				return arr[keys[i]];
			}
		}
	},
	
	getAllComponentsOf: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
		
		if (this.entityMap[entity])
			return Object.keys(this.entityMap[entity]);	
		else
			return null;
	},
	
	removeComponent: function(ent, comp){
		this.entityMap[ent][comp] = null;
		delete this.entityMap[ent][comp];
		
		var arr = this.componentMap[comp]
		for (var i = 0; i < arr.length; i++){
			entity = arr[i]
			if (entity == ent){
				entity = null;
				arr.splice(i,1);
			}
		}
	},
	
	removeEntity: function(ent){
		var entity = ent;
		if (entity.constructor == String){
		}
		else{
			entity = entity.name;	
		}
				
		var comps = this.getAllComponentsOf(entity);
		for (var i = 0; i < comps.length; i++){
			this.removeComponent(entity,comps[i]);
		}
		
		this.entityMap[entity] = null; //URGENT: DO I NEED TO GET RID OF ALL ITS ENTRIES AND SUB OBJECTS? PROLLY NOT!
		delete this.entityMap[entity];		
	}
}
//Entity Manager
Entity.prototype.constructor = Entity;
function Entity(entityMan, compArr){
	this.EM = entityMan;
	this.name = this.EM.createEntity();	

	for (var i = 0; i < compArr.length; i++){
		this.EM.addComponent(this.name, compArr[i]);
	}
	
	return this.name;
}

Entity.prototype.getComponent = function(comp){
	return this.EM.getComponent(this.name, comp);	
}

Entity.prototype.addComponent = function(comp){
	return this.EM.addComponent(this.name, comp);	
}

Entity.prototype.removeComponent = function(comp){
	return this.EM.removeComponent(this.name, comp);	
}

Entity.prototype.hasComponent = function(comp){
	return this.EM.hasComponent(this.name, comp);	
}

Entity.prototype.remove = function(){
	return this.EM.removeEntity(this.name);	
}
//Entity Class
/*

var ent = EntityManager.createEntity();
var ent2 = EntityManager.createEntity();
EntityManager.addComponent(ent2, new Spatial(100,100));
EntityManager.addComponent(ent, new Spatial(100,100));


if  (EntityManager.getComponent(ent, "Spatial").x != 100){
	alert("Catch1");	
}
if (EntityManager.getAllEntitiesWith("Spatial").toString() != "entity_2,entity_1"){
	alert("Catch2");
}

EntityManager.removeComponent(ent2, "Spatial");

if (EntityManager.getAllEntitiesWith("Spatial") != "entity_1"){
	alert("Catch3");	
}

if (EntityManager.hasComponent(ent, "Spatial") == false){
	alert("Catch3-1");	
}



var ent3 = new Entity(EntityManager, [new Spatial(100,100)]);

if  (EntityManager.getComponent(ent3, "Spatial").x != 100){
	alert("Catch4");	
}

if (EntityManager.getAllEntitiesWith("Spatial").toString() != "entity_1,entity_3"){
	alert("Catch5");
}

if (ent3.getComponent("Spatial").y != 100){
	alert("Catch5");	
}

ent3.removeComponent("Spatial")

if (EntityManager.getAllEntitiesWith("Spatial") != "entity_1"){
	alert("Catch6");	
}

ent3.addComponent(new Spatial(200,200));

if (ent3.getComponent("Spatial").y != 200){
	alert("Catch5");	
}

if (ent3.hasComponent("Spatial") == false || ent3.hasComponent("BLOB") == true){
	alert("Catch6");	
}


ent3.remove();
if (EntityManager.getAllComponentsOf(ent3) != null){
	alert("Catch7");
}

if (EntityManager.getAllEntitiesWith("Spatial") != "entity_1"){
	alert("Catch8");	
}
*/
//Testing Code

function SubSystemRender(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Renderer");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"Renderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if (!pos.width){
					var nImg = AM.getAsset(rend.image);
					pos.width = nImg.width * rend.sizeX;
					pos.height = nImg.height * rend.sizeY;
				}

				this.ctx.save(); 
					this.ctx.translate(pos.x, pos.y);
					this.ctx.rotate(pos.rot);
					var asset = AM.getAsset(rend.image);
					if (rend.image != ROCKET){
						this.ctx.drawImage(asset, -asset.width/2, -asset.height/2);
					}
					else{
						if (this.EM.getComponent(ent, "ArtificialInput")){
							//if (ctx.fillStyle != "#aa0000")
								ctx.fillStyle = "rgb("+1+this.EM.getComponent(ent,"ShipController").team*30+","+1+this.EM.getComponent(ent,"ShipController").team*30 + ","+1+this.EM.getComponent(ent,"ShipController").team*30+";"
						}
						else{
							ctx.fillStyle =  playerStyle;
						}
						ctx.beginPath();  
						ctx.moveTo(25,0);  
						ctx.lineTo(-10,-10);  
						ctx.lineTo(-10,10);  
						ctx.fill();  
					}
				this.ctx.restore();
			}
		}
	}
}


function SubSystemSpatial(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Spatial");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var pos = this.EM.getComponent(ents[i], "Spatial");
				if (pos.rot > Math.PI * 2 || pos.rot < Math.PI * -2){
					pos.rot = pos.rot % (Math.PI * 2);	
				}
			}
		}
	}
}


function SubSystemRectRender(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;

	this.update = function(delta){
		var lastStyle = this.ctx.fillStyle;

		var ents = this.EM.getAllEntitiesWith("RectRenderer");
		if (ents){
			for (var i = 0; i< ents.length; i++){							
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"RectRenderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				var style = rend.color;
				
				if (!pos.width){
					pos.width = rend.width;
					pos.height = rend.height;
				}
				
				if (style != lastStyle){
					this.ctx.fillStyle = style;
					lastStyle = style;
				}

				var rot = pos.rot;
				//this.ctx.save(); 
					this.ctx.translate(pos.x, pos.y);
					if (!(rot < .1 && rot > -.1))
						this.ctx.rotate(rot);			
					this.ctx.fillRect(-rend.width/2,-rend.height/2, rend.width, rend.height);
					if (!(rot < .1 && rot > -.1))
						this.ctx.rotate(-rot);								
					this.ctx.translate(-pos.x, -pos.y);
				//this.ctx.restore();
			}
		}
		this.ctx.fillStyle = "rgb(255,255,255)";
	}
}



function SubSystemMovement(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Movement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if (move.apply){
					pos.x = pos.x + move.vec.getX() * delta;
					pos.y = pos.y + move.vec.getY() * delta;
				}
			}
		}
	}	
}


function SubSystemStarWrap(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("StarWrap");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				
				pos.x += canvas.width;
				pos.y += canvas.height;

				pos.x = pos.x % canvas.width;
				pos.y = pos.y % canvas.height;
				
				//move = this.EM.getComponent(ent,"Movement").vec;	
				//star = this.EM.getComponent(ent,"StarWrap");
				//move.setX(move.getX() / star.d);	
				//move.setY(move.getY() / star.d);
			}
		}
	}	
}

function SubSystemDeletetions(EntityMan, ctext){
	this.EM = EntityMan;
	this.ctx = ctext;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("DeleteWhenOffScreen");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var dist = this.EM.getComponent(ent,"DeleteWhenOffScreen").dist;
				var w = this.ctx.canvas.width;
				var h = this.ctx.canvas.height;
				
				if (pos.x > w + dist || pos.x < 0 - dist || pos.y > h + dist || pos.y < 0 - dist){
					this.EM.removeEntity(ent);	
				}
			}
		}
	}	
}



function SubSystemParticles(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ParticleController");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement").vec;
				var rend = this.EM.getComponent(ent,"RectRenderer");
				var partC = this.EM.getComponent(ent,"ParticleController");
				var initSpeed = partC.initSpeed;
				
				
				var acc = 200;
				move.addToMag(-acc*delta);
				
				if (move.getMag() < initSpeed /2 && !partC.shrunk){
					rend.width = rend.width / 2;
					rend.height = rend.height / 2;
					partC.shrunk = true;	
				}
				if (move.getMag() < acc*.1){
					this.EM.removeEntity(ent);	
				}
			}
		}
	}	
}




function SubSystemShipController(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ShipController");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				var inputs = this.EM.getComponentStartsWith(ent, "Input");
				var ship = this.EM.getComponent(ent, "ShipController");
				var rend = this.EM.getComponentStartsWith(ent, "Renderer");
	
				if (inputs.left){
					pos.rot -= ship.dRot;
					ship.dirFacing -= ship.dRot;
					//this.updateCtx();
				}
				else if (inputs.right){
					pos.rot += ship.dRot;
					ship.dirFacing += ship.dRot;
					//this.updateCtx();		
				}
				
				if (inputs.up){
					if (move.vec.getMag() < ship.maxSpeed){
						var dirx = Math.cos(ship.dirFacing)  * ship.acc;
						var diry = Math.sin(ship.dirFacing)  * ship.acc;
						move.vec.add(dirx, diry);
					}
					/*for (var j = 0; j < 10; j++){
						CreateParticle({r: 255, g:  Math.floor(Math.random() * 150), b: Math.floor(Math.random() * 10)},
													 ship.dirFacing - Math.PI - Math.PI / 4 + ((Math.PI / 2) * Math.random()), 
													 100 + ship.maxSpeed/10*Math.random(),
													 pos.x  + Math.cos(ship.dirFacing - Math.PI) * 18 , 
													 pos.y + Math.sin(ship.dirFacing - Math.PI) * 18  , 
													 3); 
					}*/
				}
				else if (!inputs.up){	
				}
			
				if (move.vec.getMag() > ship.airRes){ 
					move.vec.addToMag(-ship.airRes);
				}
				else {
					if (move.vec.getMag() != 0)
						move.vec.setMag(0);	
				}
				
				
				/*if (inputs.shoot && ship.timeSinceLastShot > ship.timeBetweenShots){
					var dist = 60;
					CreateBasicBullet(ent, pos.x + Math.cos(ship.dirFacing) * dist, pos.y + Math.sin(ship.dirFacing) * dist, rend.rot);
					ship.timeSinceLastShot = 0;
				}
				
				ship.timeSinceLastShot += delta;*/
			
			}
		}
	}	
}

function SubSystemGuns(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Gun");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var inputs = this.EM.getComponentStartsWith(ent, "Input");
				var gun = this.EM.getComponent(ent, "Gun");
				gun.timeSinceLastShot += delta;
				
				if (inputs.shoot && gun.timeSinceLastShot > gun.timeBetweenShots){
					var pos = this.EM.getComponent(ent,"Spatial");
					var rend = this.EM.getComponentStartsWith(ent, "Renderer");
					var move = this.EM.getComponent(ent, "Movement");
					
					var dist = gun.offSet;
					var func = "Create";
					func += gun.type;
					func += "Bullet";
					
					var fn = window[func];
					if(typeof fn === 'function') {
						fn(ent, pos.x, pos.y, dist, pos.rot, move.vec.getMag());
					}

					//CreateDoubleBullet(ent, pos.x, pos.y, dist, rend.rot);
					
					gun.timeSinceLastShot = 0;
				}
			}
		}
	}
}

function SubSystemArtificialInput(EntityMan){
	this.EM = EntityMan;
	this.stopDistance = 300;
	this.shootDistance = 400;
	this.shootRange = Math.PI / 8;
	this.visionDistance = 2000;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ArtificialInput");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				
				var out = this.EM.getComponent(ent, "ArtificialInput");
				var myPos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponentStartsWith(ent, "Render");	
				var cont = this.EM.getComponent(ent, "ShipController");
						
				var others = this.EM.getAllEntitiesWith("ShipController");
				var bestDistance = [1000000000,""];
				
				for (var j = 0; j< others.length; j++){
					var currentEnt = others[j];
					if (currentEnt != ent && cont.team != this.EM.getComponent(currentEnt, "ShipController").team){
						var hisPos = 	this.EM.getComponent(currentEnt,"Spatial");
						
						var dist = (myPos.x - hisPos.x)*(myPos.x - hisPos.x) + (myPos.y - hisPos.y)*(myPos.y - hisPos.y);
						if (dist < bestDistance[0]){
							bestDistance = 	[dist,currentEnt];
							if (bestDistance[0] < this.stopDistance){
								break;
							}
						}
					}
				}
				
				var target = bestDistance[1];
				var distance = Math.sqrt(bestDistance[0]);
				
				if (distance < this.visionDistance){
					out.up = true;
					if (distance < this.stopDistance){
						out.up = false;	
					}
					
					var hisPos = this.EM.getComponent(target,"Spatial");
					var x1 = Math.cos(myPos.rot);
					var y1 = Math.sin(myPos.rot);
					
					var x2 = hisPos.x - myPos.x;
					var y2 = hisPos.y - myPos.y;
					var mag = Math.sqrt(x2*x2 + y2*y2);
					x2 = x2/mag;
					y2 = y2/mag;
					var angle1 = Math.atan2(y1,x1);
					var angle2 = Math.atan2(y2,x2);
					var angle = angle2 - angle1;
					
					if (Math.abs(angle) < this.shootRange && distance < this.shootDistance){
						out.shoot = true;
					}
					else{
						out.shoot = false;
					}
					
					if (Math.abs(angle) > 5 / 180 * Math.PI){
						if (angle > 0){
							out.right = true;
						}
						else if (angle < 0){
							out.left = true;
						}
					}	
					else{
						out.left = false;
						out.right  = false;	
					}
				}
			}
		}
	}
		
};

function SubSystemHumanInput(EntityMan){
	this.EM = EntityMan;

	this.up = 38;
	this.left = 37;
	this.right = 39;
	this.shoot = 32;
	
	this.keyMap = {
		"38" : "up",
		"37" : "left",
		"39" : "right",
		"32" : "shoot"
	};
	
	
	this.keyDown = function(key){
		if ( this.keyMap[key.toString()] ){
			var dwn = this.keyMap[key.toString()];
			
			var ents = this.EM.getAllEntitiesWith("Input-Human");
			
			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				input[dwn] = true;
			}
		}
	};
	
	this.keyUp = function(key){
		if ( this.keyMap[key.toString()] ){
			var up = this.keyMap[key.toString()];
			
			var ents = this.EM.getAllEntitiesWith("Input-Human");

			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				input[up] = false;
			}
		}
	};	
		
};

function SubSystemAffectedByPlayer(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var move = player.getComponent("Movement").vec;

		var ents = this.EM.getAllEntitiesWith("AffectedByPlayerMovement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				//move1 = this.EM.getComponent(ent,"Movement").vec;

				//move1.setX(-move.getX());
				//move1.setY(-move.getY());	
				aff = this.EM.getComponent(ent,"AffectedByPlayerMovement");
				
				pos.y += (-move.getY() * delta) / aff.d;
				pos.x += (-move.getX() * delta) / aff.d;
			}
		}
	};
};


function SubSystemCollisions(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Collider");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponentStartsWith(ent, "Renderer");
				
				var w = pos.width;
				var h = pos.height;
				var x = pos.x;
				var y = pos.y;
				
				for (var j = 0; j< ents.length; j++){
					var nEnt = ents[j];	
					var nPos = this.EM.getComponent(nEnt,"Spatial");
					var nRend = this.EM.getComponentStartsWith(nEnt, "Renderer");
					var nw = pos.width;
					var nh = pos.height;
					var nx = nPos.x;
					var ny = nPos.y;
					
					if (x + w / 2 > nx - nw / 2 && x - w / 2 < nx + nw/2 && y + h / 2 > ny - nh / 2 && y - h / 2 < ny + nh/2 && !(ent == nEnt)){//quick and dirty
						var nCollide = this.EM.getComponent(nEnt, "Collider").type;
						var Collide = this.EM.getComponent(ent, "Collider").type;
						
						var remove1 = false;
						var remove2 = false;
						
						if (this.shouldCollide(nCollide, Collide)){
							if (this.EM.getComponent(ent, "Health")){
								if ( this.EM.getComponent(nEnt, "Damager"))	{
									var h = this.EM.getComponent(ent, "Health");
									if (h.health <= 1){
										remove1 = true;
									}
									else{
										h.health -= 1; 	
									}
								}
								
								if (this.EM.getComponent(nEnt, "PowerUpHolder") && this.EM.getComponent(ent, "PowerUpManager")){
									this.EM.getComponent(ent, "PowerUpManager").addPowerUp(ent, this.EM.getComponent(nEnt, "PowerUpHolder").pwUp);
								}
							}
							else{
								remove1 = true;
							}
							
							
							if (this.EM.getComponent(nEnt, "Health")){
								if (  this.EM.getComponent(ent, "Damager") ) {
									var h = this.EM.getComponent(nEnt, "Health");
									if (h.health <= 1){
										remove2 = true;
									}
									else{
										h.health -= 1; 	
									}
								}
								
								if (this.EM.getComponent(ent, "PowerUpHolder") && this.EM.getComponent(nEnt, "PowerUpManager")){
									this.EM.getComponent(nEnt, "PowerUpManager").addPowerUp( nEnt, this.EM.getComponent(ent, "PowerUpHolder").pwUp);
								}								
							}
							else{
								remove2 = true;
							}
						
							if ((ent == player.name && remove1) ||( nEnt==player.name && remove2)){
								var time = Date.now() - backThen;
								var stringy = "GAME OVER! \nYou lasted " + time/1000 + " seconds and killed " + killCount + " enemies.";
								if (cheated){
									stringy += "\nBut, you cheated."	
								}
								alert(stringy);	
								window.location.reload(true);
							}
							
							if ((this.EM.getComponent(ent, "ArtificialInput")  && remove1)||(this.EM.getComponent(nEnt, "ArtificialInput") && remove2)){
								killCount ++;
								currentEnemyCount--;
								if (remove1){
									if (this.EM.hasComponent(ent, "PowerUpManager")){
										this.dropPowerUps(x,y, this.EM.getComponent(ent, "PowerUpManager") );	
									}
								}
								else if (remove2){
									if (this.EM.hasComponent(nEnt, "PowerUpManager")){
										this.dropPowerUps(nx, ny, this.EM.getComponent(nEnt, "PowerUpManager") );	
									}
								}
							}
						
							if (remove1){
								this.EM.removeEntity(ent);	
								i = 100000; //Hackey...we need a way to exit the main loop if ent is destroye
								j = 100000;
							}
							
							if (remove2){
								this.EM.removeEntity(nEnt);	
								break;
							}
						} 
					}
				}
			}
		}
	};
	
	this.dropPowerUps = function(x,y, manager){
		for (var i = 0; i < manager.currentPowerUps.length; i++){
			CreatePowerUp(x + Math.random() * 100 - 50, y + Math.random() * 100 - 50, manager.currentPowerUps[i]	);
		}
	}
	
	
	this.shouldCollide = function(a, b){
		if (a==b){
			return false;	
		}
		
		switch (a){
			case fleshlingCollision:
				switch (b){
					case bulletCollision:
						return true;
						break;
					case powerUpCollision:
						return true;
						break;
				}
				break;	
			case bulletCollision:
				switch (b){
					case fleshlingCollision:
						return true;
						break;	
					case powerUpCollision:
						return false;
						break;
				}
				break;
			case powerUpCollision:
				switch (b){
					case fleshlingCollision:
						return true;
						break;	
					case bulletCollision:
						return false;
						break;
				}
				break;
		}
		
	}
};


var main = function () {
	var now = Date.now();
	var delta = now - then;
	delta = delta/1000;
	
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);

	
	ctx.save()
		ctx.fillStyle = "rgb(200,0,0)";
		ctx.translate(10, 20);
		ctx.fillRect(0,0, 3 * player.getComponent("Health").startHealth, 4);
		ctx.fillStyle = "rgb(255,0,0)";		
		ctx.fillRect(0,0, 3 * player.getComponent("Health").health, 4);
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


var SubSystems = [SubRectRenderer,SubRenderer, SubMovement, SubShipController, SubArtificialInput, SubAffected, SubStarWrap, SubDelete, SubParticles, SubCollisions, SubGuns, SubPositions]
var player = null; 

//EntityManager.getComponent(player.name, "PowerUpManager").addPowerUp(player.name, new PowerUp("ShipController", [{what:"maxSpeed", setTo: 1000}]));
//EntityManager.getComponent(player.name, "PowerUpManager").addPowerUp(player.name, new PowerUp("ShipController", [{what:"acc", setTo: 100}]));

var backThen = 0;
var killCount = 0;
						
var init = function(){
	player = 	new Entity(	EntityManager, [new Spatial(400,400), new Movement(100,0, false), new HumanInput(),
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
	player.getComponent("Spatial").x = ctx.canvas.width/2;
	player.getComponent("Spatial").y = ctx.canvas.height/2;
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