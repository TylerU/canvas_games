function Vec2(ang, mg)  //We only have 2 properites: Angle and Magnitude! Everything else (Currently) will be decided when asked of us	
{
	if (ang)
		this.angle = ang;	
	else
		this.angle = 0;
		
	if (mg)
		this.mag = mg;
	else
		this.mag = 0;
}

Vec2.prototype.getX = function(){
	return (Math.cos(this.angle) * this.mag) ;	 //Return the magnitudized x value
}

Vec2.prototype.getY = function(){
	return (Math.sin(this.angle) * this.mag) ;	//Return the magnitudized y value
}

Vec2.prototype.getNormX = function(){
	return(Math.cos(this.angle)) ;	 // Return the normal x value	
}

Vec2.prototype.getNormY = function(){
	return(Math.sin(this.angle)) ;	  // Return the normal y value
}

Vec2.prototype.getMag = function(){
	return this.mag;	//Return the current magnitude
}

Vec2.prototype.getAngle = function() {
	return this.angle;		//Return the current angle
}

Vec2.prototype.setAngle = function(ang) {
	this.angle = ang;	//Set the angle to the given angle
}

Vec2.prototype.setMag = function(mg){
	this.mag = mg;	// Set the current angle to the given angle
}

Vec2.prototype.addToMag = function(val) {
	this.mag += val;		//Take our current magnitude and add the value given!
}

Vec2.prototype.add = function(dirx, diry){
	this.setAngle(Math.atan2(this.getY() + diry,this.getX() + dirx));	
	this.setMag(Math.sqrt((this.getY() + diry)*(this.getY() + diry) + (this.getX() + dirx)*(this.getX() + dirx)));
}

Vec2.prototype.setX = function(x){
	this.setAngle(Math.atan2(this.getY() ,x));	
	this.setMag(Math.sqrt(this.getY()*this.getY() + x*x));	 
}

Vec2.prototype.setY = function(y){
	this.setAngle(Math.atan2(y , this.getX()));	
	this.setMag(Math.sqrt(y*y + this.getX()*this.getX()));	 
}

Vec2.prototype.revert = function(){
	this.setMag(0);
	this.setAngle(0);	
}