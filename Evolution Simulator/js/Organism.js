// JavaScript Document

Organism.prototype = new Entity();
Organism.prototype.constructor = Organism;

Organism.prototype.width = 2;

Organism.prototype.maxMaxHealth = 30;	
Organism.prototype.minMaxHealth = 7;
Organism.prototype.healthmultiplier = 1;
Organism.prototype.healthUpdateInterval = 60;
Organism.prototype.reproductionInterval = 31 * 60;
Organism.prototype.damageInterval = 200;
Organism.prototype.maxSpeed  = 4;
Organism.prototype.healthFromFood = 10;
Organism.prototype.babyDistMin = 10;
Organism.prototype.babyDistMax = 50;
//Organism.prototype.maxRot =  Math.toRadians(3.5);
//Organism.prototype.minRot =  Math.toRadians(0);



function Organism (gamein, x, y, myGenome){	
	this.game = gamein;
	
	this.dx = 1;
	this.dy = 0;
	this.x = x;
	this.y = y;
	
	this.angle = 0;
	
	this.sinceLastHealthUpdate = 0;
	this.sinceLastReproductionUpdate = 0;
	this.sinceLastDamage = 1000;
	
	this.genome = myGenome;

	this.radius = myGenome.getSize();
	
	this.speed = this.maxSpeed * ((myGenome.maxSize - myGenome.getSize()) / myGenome.maxSize)  + .5;
	this.maxHealth = this.maxMaxHealth * (myGenome.getSize() / myGenome.maxSize);
	if (this.maxHealth < this.minMaxHealth)
		this.maxHealth = this.minMaxHealth;
		
	this.health = this.maxHealth;
	
	this.net = new NeuralNet(myGenome);
	this.inputs = [];
	
	this.colors = myGenome.getColor();
	this.sensors = myGenome.getSensors();
}

Organism.prototype.draw = function() {
	var thisX = Math.floor(this.getX());
	var thisY = Math.floor(this.getY());
	
	ctx.beginPath();
	ctx.fillStyle = "rgb(" + Math.floor(this.colors[0]) + "," + Math.floor(this.colors[1]) + "," + Math.floor(this.colors[2]) + ")";
	ctx.arc(thisX, thisY, Math.floor(this.radius), 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.arc(thisX, thisY, Math.floor(this.radius/4*2), 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();


	ctx.beginPath();
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.arc(this.getX() - Math.cos(this.angle) * this.radius/5, this.getY() - Math.sin(this.angle) * this.radius/5, Math.floor(this.radius/4*1), 0, Math.PI*2, true); 
	ctx.closePath();//Sometimes eye is facing backwards :/   ...    :(
	ctx.fill();
	
	
	ctx.fillStyle = "rgb(0,190, 0)";
	ctx.fillRect(thisX - 10, thisY - 10, Math.floor(this.getHealth() * 2), 5 );
}

Organism.prototype.update = function() {
	//console.log(this.angle);
	this.sinceLastHealthUpdate += 1;
	this.sinceLastReproductionUpdate += 1;
	this.sinceLastDamage += 1;
	
	if (this.sinceLastReproductionUpdate > this.reproductionInterval){
		this.reproduce();
		this.sinceLastReproductionUpdate = 0;
	}
	
	if (this.sinceLastHealthUpdate > this.healthUpdateInterval){
		this.health -= 1;
		this.sinceLastHealthUpdate = 0;
		if (this.health<=0){
			this.remove = true;
		}
	}
	
	for (var xxx = 0; xxx < this.game.getOrganismList().length; xxx++){	
		var org = this.game.getOrganismList()[xxx];
			
		if (org !== this){
			for (var yyy = 0; yyy<this.sensors.length; yyy++){
				this.sensors[yyy].onEachOrganism(this, org);	
			}
			
			// this.checkCollisions(org);
		}
	}
	
	
	this.checkForFood();
	this.updateInputs();
	this.updateOutputs(this.net.getOutput(this.inputs));
	this.x+=this.dx;
	this.y+=this.dy;
	
	this.resetSensors();
}


Organism.prototype.damage = function(org, damage){
	if (this.sinceLastDamage > this.damageInterval){
		this.game.addSplatter(new Splatter(this.game, this.getX(), this.getY(), this.getColor(), org.dx, org.dy, 10));
		org.AddToHealth(damage);
		this.removeFromHealth(damage);
		this.sinceLastDamage = 0;
	}
}
	
Organism.prototype.checkCollisions = function(org){
	if (Dist(org.getX(), org.getY(), this.getX(), this.getY()) < this.radius + org.radius){
		//Colliding
		var dott =  Dot(this.dx, this.dy, org.getX() - this.getX(), org.getY() - this.getY());
		if ( dott > Math.cos(Math.PI/4) ){ ////We are moving toward this guy
			var mag = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
			var maxDmgAtSpeed = mag/(this.maxSpeed*2) * 15;
			var damage  = Math.ceil(dott * maxDmgAtSpeed);
			
			org.damage(this, damage);
		}
	}
}

Organism.prototype.resetSensors = function(){
	for (var yyy = 0; yyy<this.sensors.length; yyy++){
		this.sensors[yyy].resetMe();	
	}
}


Organism.prototype.checkForFood = function() {
	var foodlist = this.game.getFoodList(); 
	
	var best = null;
	
	var closestdist = 1000000000;


	for (var fd in foodlist){
		var curFood = foodlist[fd];
		var distance = Dist( this.getX(),  this.getY(), curFood.getX(), curFood.getY());
		
		if (distance < closestdist){
			closestdist = distance;
			best = curFood;
		}

		if (distance < this.radius + Food.prototype.radius){
			this.AddToHealth(this.healthFromFood);

			curFood.remove = true;
			//return;
		}			
	}
	
	if (best !== null)
		this.closestFood = best;
	else
		console.log("PROB");

}


Organism.prototype.AddToHealth = function(hp){
	this.health += hp;
	if (this.health>=this.maxHealth)
		this.health = this.maxHealth;
}

Organism.prototype.removeFromHealth = function(hp){
	this.health -= hp;
	if (this.health<=0){
		this.remove = true;
	}
}

Organism.prototype.reproduce = function() {
	//if (this.health > this.maxHealth/2){
		var org = new Organism(this.game,  this.getX() + RandomClamped(this.babyDistMin, this.babyDistMax),
				 this.getY() + RandomClamped(this.babyDistMin, this.babyDistMax), Genome.prototype.MutateGenome(this.genome))  ;
				
		this.game.addOrganism(org );
	//}
}
	
	
	
Organism.prototype.updateOutputs = function(outs) {
	var lwheel = outs[0];
	var rwheel = outs[1];
	//System.out.println(lwheel);
	var minRot = .01;//FIX 
	var maxRot = 4.0 / 180 * Math.PI;//FIX
	
	
	var trackspeed = lwheel + rwheel; 
	trackspeed *= this.speed;
	currentSpeed = trackspeed;
	
	var rot = lwheel - rwheel;
	if (Math.abs(rot) < minRot)
		rot = 0;
	
	if (rot > maxRot)
		rot = maxRot;
	if ( rot < -maxRot)
		rot = -maxRot;
	
	this.angle += rot; 
	
	this.dx =  Math.cos(this.angle);
	this.dy =  Math.sin(this.angle);
	this.dx *= trackspeed;
	this.dy *= trackspeed;
}

	
	
Organism.prototype.updateInputs = function() {
	this.inputs = [];
	
	for (var i = 0; i<this.sensors.length; i++){
		var curOut = this.sensors[i].getOutput(this, this.game);
		if (curOut instanceof Array){
			this.inputs = this.inputs.concat(curOut);
		}
		else{
			this.inputs.push(curOut);
		}
	}
}



Organism.prototype.getHealth = function(){
	return this.health;
}
	
	
Organism.prototype.getColor = function(){
	return this.colors;
}
	
	
Organism.prototype.setHealth = function(newHealth){
	this.health = newHealth;
}
