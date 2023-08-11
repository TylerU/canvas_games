var core = {};


core.Entity = function(){
		this.x = 0;
		this.y = 0;
		this.vec = new Vec2(0,0);
		this.rot = 0; 
		this.sprite = null;
}


core.Entity.prototype.draw = function(is_local_player){ 
	ctx.save(); 
		//ctx.translate(this.x, this.y);
		//if (is_local_player){
		//	ctx.translate(ctx.canvas.width/2, this.y);
		//}
		//else{
			ctx.translate(this.x, this.y);
		//}

		ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);  
		//ctx.strokeRect(-this.sprite.width / 2 - ctx.canvas.width/2, -this.sprite.height / 2, this.sprite.width, this.sprite.height)
	ctx.restore();
}

core.Entity.prototype.update = function(delta){
	this.x += this.vec.getX() * delta;
	this.y += this.vec.getY() * delta;
}

core.Entity.prototype.rotateAndCache = function(image) {
	var offscreenCanvas = document.createElement('canvas');
	var offscreenCtx = offscreenCanvas.getContext('2d');
	
	var size = Math.sqrt(image.width * image.width  + image.height * image.height);
	offscreenCanvas.width = image.width;
	offscreenCanvas.height = image.height;
	
	offscreenCtx.save();
		offscreenCtx.translate(image.width/2, image.height/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(image, -(image.width/2), -(image.height/2));
	offscreenCtx.restore();
	
	return offscreenCanvas;
}

core.Entity.prototype.updateCtx = function(){
	var offscreenCtx = this.sprite.getContext('2d');
	
	var size = Math.max(this.sprite.width, this.sprite.height);
	offscreenCtx.clearRect(0,0, size, size);

	offscreenCtx.save();
		offscreenCtx.translate(size/2, size/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(this.myImage, -(this.myImage.width/2), -(this.myImage.height/2));
	offscreenCtx.restore();
}






core.Rect = function(x1,y1,width1,height1){
	if (y1 != undefined){
		this.x = x1;
		this.y = y1;
		this.width = width1;
		this.height = height1;
	}
	else{
		this.x = x1.x;
		this.y = x1.y;
		this.width = x1.width;
		this.height = x1.height;
	}
}

core.Rect.prototype.draw = function(x,y){
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.fillRect(-this.width/2 + x,-this.height/2, this.width, this.height);
		//ctx.strokeRect(-this.width/2,-this.height/2, this.width, this.height)
	ctx.restore();		
}





core.BackGround = function() {
	this.ents = [];	
	this.xOff = 0;
	this.yOff = 0;
}

core.BackGround.prototype.draw = function(){
	ctx.fillStyle = "rgb(255,0,255)"
	for (var i = 0; i < this.ents.length; i++){
		this.ents[i].draw(this.xOff, 0);
		//this.ents[i].draw(0, 0);	
	}
}

core.BackGround.prototype.update = function(x){
	this.xOff = x;
}





core.isCollision  = function (rect1, rect2){
	var leftX = rect1.x - rect1.width/2;
	var rightX = rect1.x + rect1.width/2;
	var topY = rect1.y - rect1.height/2;
	var bottomY = rect1.y + rect1.height/2;
	
	var lX = rect2.x - rect2.width/2;
	var rX = rect2.x + rect2.width/2;
	var tY = rect2.y - rect2.height/2;
	var bY = rect2.y + rect2.height/2;
		
		
	if ( rightX > lX && leftX < rX && bottomY > tY && topY < bY){ //COLLISION
		return true;
	}
	else{ 
		return false;
	}
	
}






core.PhysicsState = function(locX, locY, vecX, vecY, accX, accY, w, h) {
	this.loc = new Vec2(locX, locY);
	this.speed = new Vec2(vecX, vecY);
	this.acc = new Vec2(accX, accY);
	this.size = new Vec2(w,h);
	this.getRect = function(){
		return new core.Rect(this.loc.getX(), this.loc.getY(), this.size.getX(), this.size.getY());
	}
}



core.Hero = function() {
	this.x = 0;
	this.y = 0;
	this.maxSpeed = 200;
	this.acce = 2000;
	this.res = 150;
	this.gravity = 3000;
	this.jumping = false;
	this.lastUp = false;
	
	this.jumpInTime = 100;
	this.jumpTime=0;
	this.onPlatform = false;

	this.correctionVec = new Vec2(0,0);

	this.inputs = {left: false, right:false, up: false, shoot:false};


	if (this.myImage){
		this.sprite = this.rotateAndCache(this.myImage);
	}
}



core.Hero.prototype = new core.Entity();
core.Hero.prototype.constructor = core.Hero; 
core.Hero.prototype.sprite = null; 
core.Hero.prototype.myImage = null;
core.Hero.prototype.width = 0;
core.Hero.prototype.height = 0;

core.Hero.prototype.isOnGround = function(){
	if (this.onPlatform){
		return true;	
	}
	else {
		return false;
	}
}


core.Hero.prototype.update  = function(delta){		
	var current = new core.PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.width || this.sprite.width, this.height || this.sprite.height); //STAY! Read Only! I CONST...LEAVE IT ALONE
	var future =  new core.PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.width || this.sprite.width, this.height || this.sprite.height); //MESS WITH MEEE
	
	future.acc.add(0,this.gravity); //WHOOSH. When this is added to velocity, we shall start going down.
	
	if (this.inputs.left){
		if (Math.abs(future.speed.getX()) < this.maxSpeed){
			future.acc.add(-this.acce ,0);
		}
	}

	if (this.inputs.right){
		if (Math.abs(future.speed.getX()) < this.maxSpeed)
			future.acc.add(this.acce ,0);
	}
	
	if (Math.abs(current.speed.getX()) > 20){ //If we aren't 0
		var resistance = this.res; 
		
		if (this.isOnGround()) 
			resistance = resistance * 8;
		else
			resistance = resistance / 2;
			
		if (current.speed.getX() > 0)
			future.acc.add(-resistance , 0 );
		else 
			future.acc.add(resistance , 0);
	}
	else {
		future.speed.setX(0);
	}
	
	
	if (this.isOnGround()){
		this.jumping = false;
		future.speed.setY(0);
		future.acc.add(0,-this.gravity);	
	}
	
	if (this.inputs.up && !this.jumping && this.isOnGround()){
		future.speed.add(0,-700);
		this.jumping = true;
		this.jumpTime = 0;
	}	
	
	if (this.inputs.up && this.jumping && this.jumpTime < this.jumpInTime){
		this.jumpTime += delta * 1000;
		future.acc.add(0,-this.gravity);
	}
	else if (!this.inputs.up && this.jumping){
		this.jumpTime = 100000;
	}
	
	
	future.speed.add(future.acc.getX() * delta, future.acc.getY() * delta);

	//Account for any correction
	var percentToSub = .6;

	if(Math.abs(this.correctionVec.getX()) > .1 || Math.abs(this.correctionVec.getY()) > .1){
		future.speed.setX(future.speed.getX() + this.correctionVec.getX() * percentToSub);
		future.speed.setY(future.speed.getY() + this.correctionVec.getY() * percentToSub);

		this.correctionVec.setX(this.correctionVec.getX()  * percentToSub);
		this.correctionVec.setY(this.correctionVec.getY()  * percentToSub);
	}

	future.loc.add(future.speed.getX() * delta, future.speed.getY() * delta);
	
	var onPlat = false;
	for (var i = 0; i < BG.ents.length; i++){
		var ent = BG.ents[i];

		if (core.isCollision(future.getRect(), ent)){ //COLLISION at new point

			
			//future.loc.setY(Math.floor(ent.y) - Math.floor(ent.height/2) - Math.floor(this.sprite.height/2) +2);
			var x1 = Math.abs(ent.x - future.loc.getX());
			var y1 = Math.abs(ent.y - future.loc.getY());
			x1 -= (future.getRect().width/2 + ent.width/2);
			y1 -= (future.getRect().height/2 + ent.height/2);
			var depth = new Vec2( x1, y1  );
	
			
			if (Math.abs(depth.getX()) < Math.abs(depth.getY())){
				future.speed.setX(0);
				future.acc.setX(0);	
						
				if (future.loc.getX() > ent.x){//Move right
					future.loc.setX(Math.floor(ent.x) + Math.floor(ent.width/2) + Math.floor(future.getRect().width/2)  );
				}
				else {//MOve left
					future.loc.setX(Math.floor(ent.x) - Math.floor(ent.width/2) - Math.floor(future.getRect().width/2)  );
				}
			}
			else
			{
				if (future.loc.getY() > ent.y){//Move down
					//future.loc.setY(future.loc.getY() - depth.getY() );
					future.loc.setY(Math.floor(ent.y) + Math.floor(ent.height/2) + Math.floor(future.getRect().height/2) );
				}
				else {//Move up
					future.loc.setY(Math.floor(ent.y) - Math.floor(ent.height/2) - Math.floor(future.getRect().height/2) );
					//future.loc.setY((ent.y) - (ent.height/2) - (future.getRect().height/2) );
					this.onPlatform = true;
					onPlat = true;					
				}
				future.speed.setY(0);
				future.acc.setY(0);
			}
		}
		else {						
			continue;
		}
	}
	if (onPlat == false){
		this.onPlatform = false;
	}


	this.vec = future.speed;
	
	var dx = future.loc.getX() - current.loc.getX();
	var dy = future.loc.getY() - current.loc.getY();

	var a = 25;
	dx = dx.clamp(-a,a);
	dy = dy.clamp(-a,a);

	this.x = Math.floor(current.loc.getX() + dx);
	this.y = Math.floor(current.loc.getY() + dy);
}


try{
	module.exports = core;
}
catch (e){

}