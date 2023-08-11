// JavaScript Document
Particle.prototype = new Entity();
Particle.prototype.constructor = Particle; 

function Particle(clr, dir, mag, x1, y1, move1, initSize){
	this.vec = new Vec2(dir, mag);
	this.color  = clr;
	this.x = x1;
	this.y = y1;
	this.acc = 10;
	
	if (initSize)
		this.size = initSize;
	else
		this.size = 2;
		
	this.origMag = mag;
	this.move = move1;
	if (!move1)
		this.move = false;
}

Particle.prototype.draw = function(){
	ctx.fillStyle = "rgb(" + this.color.r + "," + this.color.g + "," + this.color.b + ")"; 
	ctx.fillRect(this.x,this.y,this.size,this.size);
}

Particle.prototype.update  = function(delta){
	if (this.move){
		Entity.prototype.update.call(this, delta);	
	}
	
	this.vec.addToMag(-this.acc);
	
	if (this.vec.getMag() < this.origMag/2){
		this.size = this.size/2;	
	}
}
