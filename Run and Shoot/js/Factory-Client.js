
var Factory = {};

Factory.CreatePlayer = function(){
	var sWidth = 16;
	var sHeight = 16;
	var sca = 2;

	var player1 = 	new Entity(EntityManager, [
						new GameComponents.Spatial(400,400), 
						new GameComponents.Movement(0,0, true), 
						new GameComponents.HumanInput(),
						new GameComponents.ShipController(300, 10),
						new GameComponents.Gun(false, false, .5, .6, 300, 1), 
						new GameComponents.Renderer({
									type:"Sprite",
									image: TILES,
									curFrame:{x: 0, y: 16}, 
									spriteWidth: sWidth, 
									spriteHeight: sHeight,
									scale: sca,
									width: sWidth * sca,
									height: sHeight * sca
								}), 
						new GameComponents.Collider(1),
						new GameComponents.XPContainer(),
						new GameComponents.Health(20),
						new GameComponents.CantLeaveScreen(),
						new GameComponents.DeleteWhenOffScreen(0),
						new GameComponents.Armor(.05)
						]);
						
	return player1;
}


Factory.CreateXP = function(x, y){
	var newX = x;
	var newY = y;

	var velocity = 500;

	var xp = 	new Entity(EntityManager, [
						new GameComponents.Spatial(newX,newY), 
						new GameComponents.Renderer({type:"Rectangle", width:10, height:10, layer: -5, color:{r:0, g:255, b:0} }),
						new GameComponents.Collider(2),
						new GameComponents.XPGiver(RandomClampedInt(1,3)),
						new GameComponents.Movement(RandomClamped(-velocity, velocity),RandomClamped(-velocity, velocity), true, 1500),
						new GameComponents.AttractedToHuman(),
						new GameComponents.DeleteWhenOffScreen(0),
						new GameComponents.DeleteAfterTime(15.0)
						]);
						
	return xp;
}



Factory.CreateHealth = function(x, y){
	var newX = x;
	var newY = y;

	var velocity = 500;

	var xp = 	new Entity(EntityManager, [
						new GameComponents.Spatial(newX,newY), 
						new GameComponents.Renderer({type:"Rectangle", width:10, height:10, layer: -5, color:{r:255, g:0, b:0} }),
						new GameComponents.Collider(2),
						new GameComponents.HealthGiver(RandomClampedInt(1, 2)),
						new GameComponents.Movement(RandomClamped(-velocity, velocity),RandomClamped(-velocity, velocity), true, 1500),
						new GameComponents.AttractedToHuman(),
						new GameComponents.DeleteWhenOffScreen(0),
						new GameComponents.DeleteAfterTime(15.0)
						]);
						
	return xp;
}




function getOutsideCoord(distOff){
	var x, y;

	if(Math.random() < .5){//Spawn left or right side
		x = RandomClamped(-distOff, distOff);
		if(x > 0)
			x=x+ctx.canvas.width;

		y = RandomClamped(-distOff, canvas.height + distOff);
	}
	else{
		y = RandomClamped(-distOff, distOff);
		if(y > 0)
			y=y+ctx.canvas.height;	

		x = RandomClamped(-distOff, canvas.width + distOff);
	}

	return {x:x, y:y};
}

Factory.CreateBadGuy = function(){
	var sWidth = 8;
	var sHeight = 13;
	var sca = 2;
	var drops = RandomClamped(0, 2);
	
	var distOff = 100;
	var coord = getOutsideCoord(distOff);
	var x = coord.x;
	var y = coord.y;

	 var a = new Entity( EntityManager, [
								new GameComponents.Spatial(x,y), 
								new GameComponents.Renderer({
									type:"Sprite",
									image: TILES,
									curFrame:{x: 52, y: 19}, 
									spriteWidth: sWidth, 
									spriteHeight: sHeight,
									scale: sca,
									width: sWidth * sca,
									height: sHeight * sca
								}), 
								// new GameComponents.ShipController(100), 
								new GameComponents.InputAndAIMovement(), 
								new GameComponents.Movement(1,0), 
								new GameComponents.Collider(2), 
								new GameComponents.Health(2), 
								new GameComponents.DeleteWhenOffScreen(100), 
								new GameComponents.Gun(false, false, 1, .1, 300),
								new GameComponents.XPDropper(drops),
								new GameComponents.Enemy()
								//  new GameComponents.PowerUpManager()
							]);

	 if(Math.random() < .5)
	 	a.addComponent(new GameComponents.HealthDropper(RandomClampedInt(1, 3)));


	 return a;
}


Factory.CreateFastGuy = function(){
	var him = Factory.CreateBadGuy();
	him.getComponent("InputAndAIMovement").speed*=2;
	him.getComponent("Gun").timeBetweenShots/=2;
	var rend = him.getComponent("Renderer");
	rend.curFrame.x = 53;
	rend.curFrame.y = 67;
	return him;
}


Factory.CreateBigBadGuy = function(){
	var sWidth = 16;
	var sHeight = 17;
	var sca = 2;
	var drops = RandomClamped(10, 20);
	
	var distOff = 100;
	var coord = getOutsideCoord(distOff);
	var x = coord.x;
	var y = coord.y;

	 var a = new Entity( EntityManager, [
								new GameComponents.Spatial(x,y), 
								new GameComponents.Renderer({
									type:"Sprite",
									image: TILES,
									curFrame:{x: 48, y: 32}, 
									spriteWidth: sWidth, 
									spriteHeight: sHeight,
									scale: sca,
									width: sWidth * sca,
									height: sHeight * sca
								}), 
								// new GameComponents.ShipController(100), 
								new GameComponents.InputAndAIMovement(), 
								new GameComponents.Movement(1,0), 
								new GameComponents.Collider(2), 
								new GameComponents.Health(10), 
								new GameComponents.DeleteWhenOffScreen(100), 
								new GameComponents.Gun(false, "Seeker", 3, .1, 500),
								new GameComponents.XPDropper(drops),
								new GameComponents.Enemy()
								// new GameComponents.PowerUpManager()
							]);

	 if(Math.random() < 1)
	 	a.addComponent(new GameComponents.HealthDropper(RandomClampedInt(5, 15)));

	 return a;
}


Factory.CreateBasicBullet = function(who, x, y, dist, rot, speed, range, damage){
	if(EntityManager.hasComponent(who, "Input-Human")){
		SM.play(PLAYER_SHOOT, false, 1.0);
	}
	else{
		SM.play(ENEMY_SHOOT, true, .05);
	}
	var bullSpeed = 500;

	var collisionChannel = EntityManager.getComponent(who, "Collider").channel;
	var sWidth = 4;
	var sHeight = 4;
	var sca = 2;

	new Entity(EntityManager, [
		new GameComponents.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new GameComponents.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed),
		// new GameComponents.Movement(0,0),
		new GameComponents.Renderer({
			type:"Sprite",
			image: TILES,
			curFrame:{x: 66, y: 82}, 
			spriteWidth: sWidth, 
			spriteHeight: sHeight,
			scale: sca,
			width: sWidth * sca,
			height: sHeight * sca
		}), 
		new GameComponents.DeleteAfterTraveledDist(range),
		new GameComponents.DeleteWhenOffScreen(0), 
		// new GameComponents.AffectedByPlayerMovement(),
		new GameComponents.Collider(collisionChannel),
		new GameComponents.Damager(damage),
		// new GameComponents.AttractedToHuman(10000, 60, 15000)
	]);
}


Factory.CreateSeekerBullet= function(who, x, y, dist, rot, speed, range, damage){
	if(EntityManager.hasComponent(who, "Input-Human")){
		SM.play(PLAYER_SHOOT, false, 1.0);
	}
	else{
		SM.play(ENEMY_SHOOT, true, .05);
	}

	var bullSpeed = 500;

	var collisionChannel = EntityManager.getComponent(who, "Collider").channel;
	var sWidth = 4;
	var sHeight = 4;
	var sca = 4;

	new Entity(EntityManager, [
		new GameComponents.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new GameComponents.Movement(0,0),
		// new GameComponents.Movement(0,0),
		new GameComponents.Renderer({
			type:"Sprite",
			image: TILES,
			curFrame:{x: 66, y: 82}, 
			spriteWidth: sWidth, 
			spriteHeight: sHeight,
			scale: sca,
			width: sWidth * sca,
			height: sHeight * sca
		}), 
		new GameComponents.DeleteAfterTraveledDist(range),
		new GameComponents.DeleteWhenOffScreen(0), 
		// new GameComponents.AffectedByPlayerMovement(),
		new GameComponents.Collider(collisionChannel),
		new GameComponents.Damager(damage*10),
		new GameComponents.AttractedToHuman(10000, 280),
		new GameComponents.Health(1),
		new GameComponents.DeleteAfterTime(5.0)
	]);
}


Factory.CreateBombBullet = function(who, x, y, dist, rot, speed, range, damage){
	var sca = .5;
	var bullSpeed = 500;
	var velocity = 500;


	new Entity(EntityManager, [
		new GameComponents.Spatial(x + Math.cos(rot) * dist,y + Math.sin(rot) * dist, rot),
		new GameComponents.Movement(Math.cos(rot) * bullSpeed, Math.sin(rot) * bullSpeed, true, 1500),
		// new GameComponents.Movement(0,0),
		new GameComponents.Renderer({
			type:"Image",
			image: BOMB,
			scale: sca,
			width: AM.getAsset(BOMB).width * sca,
			height: AM.getAsset(BOMB).height * sca
		}), 
		new GameComponents.Shake(),
		new GameComponents.DeleteWhenOffScreen(0), 
		new GameComponents.DeleteAfterTime(5.0),
		new GameComponents.ExplodeOnTimeDeletion()
	]);
}


Factory.CreateExplosion = function(x, y){
	// var collisionChannel = EntityManager.getComponent(who, "Collider").channel;
	var collisionChannel = 2;//FIX ME
	var startW = 100;

	new Entity(EntityManager, [
		new GameComponents.Spatial(x,y, 0),
		// new GameComponents.Movement(RandomClamped(-velocity, velocity),RandomClamped(-velocity, velocity), true, 1500),
		new GameComponents.Movement(0,0),
		new GameComponents.Renderer({
			type:"Rectangle",
			width: startW,
			height: startW,
			color: {r:255, g:0, b:0},
		}), 
		new GameComponents.DeleteAfterTime(0.1),
		new GameComponents.Collider(collisionChannel),
		new GameComponents.Damager(10),
		new GameComponents.SizeIncreaser(400)
	]);
}


Factory.CreateBomberGuy = function(){
	var him = Factory.CreateBigBadGuy();
	him.getComponent("Gun").timeBetweenShots*=2;
	him.getComponent("Gun").type = "Bomb";
	var rend = him.getComponent("Renderer");
	rend.curFrame.x = 65;
	rend.curFrame.y = 32;

	var hp = 20;
	him.getComponent("Health").startHealth = hp;
	him.getComponent("Health").health = hp;
	return him;
}