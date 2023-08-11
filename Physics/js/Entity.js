function Entity(){
	this.x = 0;
	this.y = 0;
	this.vec = new Vec2(0,0);
	this.rot = 0; 
	this.sprite = null;
}

Entity.prototype.draw = function(){ 
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);  
	ctx.restore();
}

Entity.prototype.update = function(delta){
	this.x += this.vec.getX() * delta;
	this.y += this.vec.getY() * delta;
}

Entity.prototype.rotateAndCache = function(image) {
	var offscreenCanvas = document.createElement('canvas');
	var offscreenCtx = offscreenCanvas.getContext('2d');
	
	var size = Math.sqrt(image.width * image.width  + image.height * image.height);
	offscreenCanvas.width = size;
	offscreenCanvas.height = size;
	
	offscreenCtx.save();
		offscreenCtx.translate(size/2, size/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));
	offscreenCtx.restore();
	
	return offscreenCanvas;
}

Entity.prototype.updateCtx = function(){
	var offscreenCtx = this.sprite.getContext('2d');
	
	var size = Math.max(this.sprite.width, this.sprite.height);
	offscreenCtx.clearRect(0,0, size, size);

	offscreenCtx.save();
		offscreenCtx.translate(size/2, size/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(this.myImage, -(this.myImage.width/2), -(this.myImage.height/2));
	offscreenCtx.restore();
}
