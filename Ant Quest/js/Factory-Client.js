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


function CreateBattleAnt(){
	var player1 = 	new Entity(EntityManager, [
						new Spatial(400,400), 
						new Movement(100,0, true), 
						new HumanInput(),
						new ShipController(PLAYER_MAX_SPEED, GOOD_TEAM), 
						new Renderer({type:"Image", img:BATTLE_ANT_IMAGE })	, 
						new CouldBeControlled(true),
						new Health(30), 
						new Collider(fleshlingCollision), 
						new Puncher(),
						new Gun(false, "SpeedBoost", .75)
						]);
						
	return player1;
}

function CreateAcidAnt(){
	var player1 = 	new Entity(EntityManager, [
						new Spatial(300,400), 
						new Movement(100,0, true), 
						new ArtificialInput(true, 300, 50),
						new ShipController(PLAYER_MAX_SPEED, GOOD_TEAM),
						new Renderer({type:"Image", img:ACID_ANT_IMAGE })	, 
						new CouldBeControlled(false),
						new Health(30), 
						new Collider(fleshlingCollision), 
						new Gun(false, "Poison", .5)
						]);
						
	return player1;
}


function CreateDeadBeetle(x,y,rot){
	var player1 = 	new Entity(EntityManager, [
						new Spatial(x, y, rot),
						new Renderer({type:"Image", img:ENEMY1_DEAD_TRAMPLE_IMAGE})
						]);
	return player1;
}


function CreateSpeedBoostBullet(who, x, y, dist, rot, speed){
	var original = EntityManager.getComponent(who, "ShipController").maxSpeed;
	EntityManager.getComponent(who, "ShipController").maxSpeed = original * 3;
	timers.add(function(){
		EntityManager.getComponent(who, "ShipController").maxSpeed = original;
	}, 500)
	
}


function CreateBadGuy(side){
	tile = Math.floor(Math.random() * level.tiles.length);
	var x = getTileLocWorld(tile).x + TILE_WIDTH/2;
	var y = getTileLocWorld(tile).y + TILE_WIDTH/2;

	var playerx = EntityManager.getComponent(getCurrentPlayerName(), "Spatial").x;
	var playery = EntityManager.getComponent(getCurrentPlayerName(), "Spatial").y;
	
	while ((!passableTiles[level.tiles[tile]]) || Math.abs(x-playerx) > 1000 || Math.abs(y-playery) > 1000){
		tile = Math.floor(Math.random() * level.tiles.length);
		x = getTileLocWorld(tile).x + TILE_WIDTH/2;
		y = getTileLocWorld(tile).y + TILE_WIDTH/2;		
	}
	

	console.log(x + " " + y + " " + playerx + " " + playery)
	
	 var a = new Entity( EntityManager, [
								new Spatial(x,y), 
								new Puncher(),
								new Renderer({type:"Image", img:ENEMY1_IMAGE }) , 
								new ShipController(ENEMY_MAX_SPEED), 
								new ArtificialInput(), 
								new Movement(1,0), 
								new DeleteWhenOffScreen(1000),
								new Collider(fleshlingCollision), 
								new Health(2)
							]);
}

function CreatePoisonBullet(who, x, y, dist, rot, speed){
	var bullSpeed = 1000 + speed + 100;
	var ab = new Entity( EntityManager,[
		new Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		new Renderer({type:"Image", img:ACID_IMAGE }),
		new AffectedByPlayerMovement(),
		new Collider(bulletCollision),
		new Damager(false, who)
	]);
}

function CreateWall(loc){
	var a = 	new Entity(EntityManager, [
						new Spatial(loc.x,loc.y, 0, TILE_WIDTH, TILE_WIDTH),  
						new Collider(wallCollision)
						]);
						
	return a;
}

var Factory = {};


Factory.CreateDeadBeetle = CreateDeadBeetle;
Factory.CreateAcidAnt = CreateAcidAnt;
Factory.CreateWall = CreateWall;
Factory.CreatePoisonBullet = CreatePoisonBullet;
Factory.CreateSpeedBoostBullet = CreateSpeedBoostBullet;
Factory.CreateBadGuy = CreateBadGuy;
Factory.CreateBattleAnt = CreateBattleAnt;