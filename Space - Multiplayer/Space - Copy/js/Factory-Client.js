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
	new Entity( [
		new Components.Spatial(x,y),
		new Components.RectRenderer(color, 50, 50),
		new Components.AffectedByPlayerMovement(1),
		new Components.PowerUpHolder(pwup),
		new Components.Collider(powerUpCollision)
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
	var player1 = 	new Entity(EntityManager, [
						new Components.Spatial(400,400), 
						new Components.Movement(100,0, true), 
						new Components.HumanInput(),
						new Components.ShipController(null, 10),
						new Components.Renderer({type:"Triangle", width:10, height:20, color:{r:0, g:0, b:255} })	, 
						new Components.Health(30), 
						new Components.Collider(fleshlingCollision), 
						new Components.Gun(false, "Basic"),
						new Components.PowerUpManager()]);
						
	return player1;
}

function CreateBadGuy(x,y){
	currentEnemyCount++;
		
	 var a = new Entity( [
								new Components.Spatial(x,y), 
								new Components.Renderer(ROCKET,2,2) , 
								new Components.AffectedByPlayerMovement(1), 
								new Components.ShipController(400), 
								new Components.ArtificialInput(), 
								new Components.Movement(1,0), 
								new Components.Collider(fleshlingCollision), 
								new Components.Health(2), 
								new Components.DeleteWhenOffScreen(1000), 
								new Components.Gun(false, false, 1), 
								new Components.PowerUpManager()
							]);
	
	if (killCount > -1) {
		var numPowers = Math.ceil(Math.random() * killCount / 10);
		for (var i = 0; i < numPowers; i++){
			if (Math.random()  < 1){
				var num = Math.floor(Math.random() * powerUps.length);
				//EntityManager.getComponent(a.name, "PowerUpManager").addPowerUp(a.name, powerUps[num]);
			}
		}
	}
}


function CreateBasicBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	new Entity( [
		new Components.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Components.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who),
	]);
}

function CreateKillerBullet(who, x, y, dist, rot, speed){
	var bullSpeed =  speed + 100;
	new Entity( [
		new Components.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Components.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who),
		new Components.ArtificialInput(),
		new Components.ShipController(false, 10), 
		new Components.Gun(false, false, 1)		
	]);
}


function CreateDoubleBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	
	var angleDif = Math.PI / 18;
	var angle1 = rot + angleDif;
	var angle2 = rot - angleDif;
	
	new Entity( [
		new Components.Spatial(x + Math.cos(angle1) * dist,y + Math.sin(angle1) * dist, rot),
		new Components.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who)
	]);

	new Entity( [
		new Components.Spatial(x + Math.cos(angle2) * dist,y + Math.sin(angle2) * dist, rot),
		new Components.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who)
	]);

}


function CreateSpreadBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	
	var angleDif = Math.PI / 18;
	var angle1 = rot + angleDif;
	var angle2 = rot - angleDif;
	
	new Entity( [
		new Components.Spatial(x + Math.cos(angle1) * dist,y + Math.sin(angle1) * dist, rot),
		new Components.Movement(Math.cos(angle1) * bullSpeed, Math.sin(angle1) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who)
	]);

	new Entity( [
		new Components.Spatial(x + Math.cos(angle2) * dist,y + Math.sin(angle2) * dist, rot),
		new Components.Movement(Math.cos(angle2) * bullSpeed, Math.sin(angle2) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who)
	]);

	new Entity([
		new Components.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Components.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Components.RectRenderer({r:255,g:0,b:0}, 20, 3),
		new Components.DeleteWhenOffScreen(100),
		new Components.AffectedByPlayerMovement(),
		new Components.Collider(bulletCollision),
		new Components.Damager(false, who)
	]);

}

var Factory = {};

Factory.CreateSpreadBullet = CreateSpreadBullet;
Factory.CreateBadGuy = CreateBadGuy;
Factory.CreateBasicBullet = CreateBasicBullet;
Factory.CreateDoubleBullet = CreateDoubleBullet;
Factory.CreateKillerBullet = CreateKillerBullet;
Factory.CreatePlayer = CreatePlayer;
Factory.CreateParticle = CreateParticle;
Factory.CreatePowerUp = CreatePowerUp;