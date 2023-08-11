
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


function CreatePlayer(){
	var player1 = 	new Entity(	EntityManager, [new Spatial(400,400), new Movement(100,0, false), new HumanInput(),
					new ShipController(null, 10), new Renderer(ROCKET, 1,1)	, new Health(30), new Collider(fleshlingCollision, 2), new Gun(false, "Basic"),
			    	new PowerUpManager()]);
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
		
	 var a = new Entity(	EntityManager, [new Spatial(x,y), new Renderer(ROCKET,2,2) , new AffectedByPlayerMovement(1), new ShipController(400), new ArtificialInput(), new Movement(1,0), new Collider(fleshlingCollision, 3), new Health(2), new DeleteWhenOffScreen(1000), new Gun(false, false, 1), new PowerUpManager()]);
	
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


