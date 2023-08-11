// JavaScript Document
function Entity(x1,y1) {
	this.x = x1;
	this.y = y1;
	this.dx = 0;
	this.dy = 0;
	this.rotation = 0;
	
	this.drawOnCanvas = function(ctx){};
	this.draw = function(){};
	this.update = function(){};
}


/**
 * Request that this entity move itself based on a certain ammount
 * of time passing.
 *
 * @param delta The ammount of time that has passed in milliseconds
 */
Entity.prototype.move = function(delta) {
	// update the location of the entity based on move speeds
	this.x += (  this.dx) ;
	this.y += ( this.dy) ;
}

/**
 * Set the horizontal speed of this entity
 *
 * @param dx The horizontal speed of this entity (pixels/sec)
 */
Entity.prototype.setHorizontalMovement= function( dx1) {
	this.dx = dx1;
}

/**
 * Set the vertical speed of this entity
 *
 * @param dy The vertical speed of this entity (pixels/sec)
 */
Entity.prototype.setVerticalMovement = function( dy1) {
	this.dy = dy1;
}

/**
 * Get the horizontal speed of this entity
 *
 * @return The horizontal speed of this entity (pixels/sec)
 */
Entity.prototype.getHorizontalMovement = function() {
	return this.dx;
}

/**
 * Get the vertical speed of this entity
 *
 * @return The vertical speed of this entity (pixels/sec)
 */
Entity.prototype.getVerticalMovement =  function() {
	return this.dy;
}



/**
 * Get the x location of this entity
 *
 * @return The x location of this entity
 */
Entity.prototype.getX = function() {
	return  this.x;
}

/**
 * Get the y location of this entity
 *
 * @return The y location of this entity
 */
Entity.prototype.getY = function() {
	return  this.y;
}

Entity.prototype.setY = function(y1) {
	this.y = y1;
}

Entity.prototype.setX = function(x1) {
	this.x = x1;
}