function Vec2(x1, y1)  	
{			

	if (x1)
		this.x = x1;	
	else
		this.x = 0;
		
	if (y1)
		this.y = y1;
	else
		this.y = 0;
		
	
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

Vec2.prototype.getMag = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);	//Return the current magnitude
}

Vec2.prototype.getAngle = function() {
	return Math.atan2(this.x, thix.y);		//Return the current angle
}

Vec2.prototype.setAngle = function(ang) {
	alert("STOP! Broken function!");
}

Vec2.prototype.setMag = function(mg){
	alert("STOP! Broken function!");
}

Vec2.prototype.addToMag = function(val) {
	alert("STOP! Broken function!");
}

Vec2.prototype.add = function(dirx, diry){
	
	if (dirx instanceof Vec2){
		this.x += dirx.getX();
		this.y += dirx.getY();
	}
	else {
		this.x += dirx;
		this.y += diry;
	}
	
	if (diry instanceof Vec2){
		this.x += diry.getX();
		this.y += diry.getY();
	}
	
}

Vec2.prototype.setX = function(x1){
	this.x = x1;
}

Vec2.prototype.setY = function(y1){
	this.y = y1;
}

Vec2.prototype.revert = function(){
	this.setX(0);
	this.setY(0);	
}