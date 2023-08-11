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

function Renderer(infoObj){
	try{
		this.type = infoObj.type;
		switch (infoObj.type){
			case "Image":
				this.image = infoObj.img;
				break;
			case "Rectangle":
				var c = infoObj.color;
				this.color = "rgb("+c.r+","+c.g+","+c.b+")";
				this.width = infoObj.width;
				this.height = infoObj.height;
				break;
			case "Triangle":
				var c = infoObj.color;
				this.color = "rgb("+c.r+","+c.g+","+c.b+")";;
				this.height = infoObj.height;
				this.width = infoObj.width;
				break;
			default:
				console.log ("I don't know what that means... - Renderer");
				break;
		}
	}
	catch (timeshifters){
		console.log("Problem in Renderer");
		//ThrowThemIntoTheShiftTimerLands(timeShifters)
	}	
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


/*RectRenderer.prototype.name = "RectRenderer";

function RectRenderer(c,w,h){
	this.color = "rgb("+c.r+","+c.g+","+c.b+")";
	this.width = w;
	if (h)
		this.height = h;
	else
		this.height = w;
}*/

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
		this.maxSpeed = 200;
		
	this.dRot = 5.1;

	if (t)
		this.team = t;
	else
		this.team = 1;
			
	//Physics
	this.acc = 50;
	this.airRes = this.acc/2;
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


function Collider(t){//Can be: Bullet, Fleshling
	this.type = t;
	this.collidedThisFrame = false;
	this.lastCollision = Date.now()
}


Puncher.prototype.name = "Puncher";


function Puncher(t){//STUPID!
}


HumanInput.prototype.name = "Input-Human";

function HumanInput(){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;
}


CouldBeControlled.prototype.name = "CouldBeControlled";

function CouldBeControlled(c){
	this.isControlled = c;
}

ArtificialInput.prototype.name = "ArtificialInput";


function ArtificialInput(whoToFollow, range, stop){
	this.up = false;
	this.left = false;
	this.right = false;
	this.shoot = false;	
	
	if (range){
		this.stopDistance = stop;
		this.shootDistance = range;
	}
	else{
		this.stopDistance = 50;
		this.shootDistance = 50;	
	}
	
	if (whoToFollow){
		this.follow = whoToFollow;
	}
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




