function Vec2(x1, y1)  	
{			

	//if (x1)
		this.setX(x1);	
	// else
	// 	this.setX(1);	
		
	// if (y1)
		this.setY(y1);
	// else
	// 	this.setY(1);
		
	
}

Vec2.prototype.getX = function(){
	return this.x;
}

Vec2.prototype.getY = function(){
	return this.y;
}

Vec2.prototype.setX = function(x1){
	this.x = x1;	
}


Vec2.prototype.setY = function(y1){
	this.y = y1;	
}


Vec2.prototype.getNormX = function(){
	return( this.x / this.getMag() ) ;	 // Return the normal x value	
}


Vec2.prototype.getNormY = function(){
	return( this.y  /  this.getMag()  ) ;	  // Return the normal y value
}

Vec2.prototype.normalize = function(){
	this.x = this.getNormX();
	this.y = this.getNormY();	
}

Vec2.prototype.getMag = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);	//Return the current magnitude
}

Vec2.prototype.getAngle = function() {
	return Math.atan2(this.y, this.x);		//Return the current angle
}

Vec2.prototype.setAngle = function(ang) {
	var mag = this.getMag();
	
	this.setX(Math.cos(ang) * mag);
	this.setY(Math.sin(ang) * mag);
}

Vec2.prototype.setMag = function(mg){
	var mag = this.getMag();
	
	if(mag !== 0){
		this.setX(this.getX() / mag * mg);
		this.setY(this.getY() / mag * mg);
	}
}

Vec2.prototype.addToMag = function(val) {
	this.setMag(this.getMag() + val);
}

Vec2.prototype.addToAngle  = function(val){
	this.setAngle(this.getAngle() + val);	
}

Vec2.prototype.add = function(dirx, diry){
	
	if (dirx instanceof Vec2){
		this.setX(this.x + dirx.getX());
		this.setY(this.y + dirx.getY());
	}
	else {
		this.setX(this.x + dirx);
		this.setY(this.y + diry);
	}
		
	if (diry instanceof Vec2){
		this.setX(this.x + diry.getX());
		this.setY(this.y + diry.getY());
	}
	
}


Vec2.prototype.revert = function(){
	this.setX(0);
	this.setY(0);	
}


try{
	module.exports = Vec2;
}
catch (e){

}