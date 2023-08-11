// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 584;
document.body.appendChild(canvas);


Number.prototype.clamp = function(min, max) {
  	 return Math.min(Math.max(this, min), max);
};


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
})();

var AM = new AssetManager();
var BG = new BackGround();
var HERO = "images/Alien1.png";
//var BACK = "images/background.png";

AM.queueDownload(HERO);
//AM.queueDownload(BACK);




function Entity(){
	this.x = 0;
	this.y = 0;
	this.vec = new Vec2(0,0);
	this.rot = 0; 
	this.sprite = null;
}

Entity.prototype.draw = function(){ 
	ctx.save(); 
		//ctx.translate(this.x, this.y);
		ctx.translate(ctx.canvas.width/2, this.y);
		ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);  
		//ctx.strokeRect(-this.sprite.width / 2 - ctx.canvas.width/2, -this.sprite.height / 2, this.sprite.width, this.sprite.height)
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
	offscreenCanvas.width = image.width;
	offscreenCanvas.height = image.height;
	
	offscreenCtx.save();
		offscreenCtx.translate(image.width/2, image.height/2);
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





function Rect(x1,y1,width1,height1){
	this.x = x1;
	this.y = y1;
	this.width = width1;
	this.height = height1;
}

Rect.prototype.draw = function(x,y){
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.fillRect(-this.width/2 + x,-this.height/2, this.width, this.height);
		//ctx.strokeRect(-this.width/2,-this.height/2, this.width, this.height)
	ctx.restore();		
}

function BackGround() {
	this.ents = [new Rect(0,400,300,50), new Rect(300,300,300,50), new Rect(450,150,300,50), new Rect(500,450,2000,100), new Rect(700,300, 300,50)];	
	this.xOff = 0;
	this.yOff = 0;
}

BackGround.prototype.draw = function(){
	ctx.fillStyle = "rgb(255,0,255)"
	for (var i = 0; i < this.ents.length; i++){
		this.ents[i].draw(this.xOff, 0);
		//this.ents[i].draw(0, 0);	
	}
}

BackGround.prototype.update = function(x){
	this.xOff = x;
}



function isCollision(rect1, rect2){
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



function PhysicsState(locX, locY, vecX, vecY, accX, accY, w, h) {
	this.loc = new Vec2(locX, locY);
	this.speed = new Vec2(vecX, vecY);
	this.acc = new Vec2(accX, accY);
	this.size = new Vec2(w,h);
	this.getRect = function(){
		return new Rect(this.loc.getX(), this.loc.getY(), this.size.getX(), this.size.getY());
	}
}

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero; 
Hero.prototype.sprite = null; 
Hero.prototype.myImage = null;

function Hero() {
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

	this.attracted = null;
}

Hero.prototype.isOnGround = function(){
	if (this.onPlatform){
		return true;	
	}
	else {
		return false;
	}
}

Hero.prototype.setAttraction = function(rect){
	this.attracted = rect;
}

Hero.prototype.unAttract = function(){
	this.attracted = null;
}

Hero.prototype.update  = function(delta, inputs){		
	var current = new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.sprite.width, this.sprite.height); //STAY! Read Only! I CONST...LEAVE IT ALONE
	var future =  new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.sprite.width, this.sprite.height); //MESS WITH MEEE
	
	future.acc.add(0, this.gravity); //WHOOSH. When this is added to velocity, we shall start going down.
	if(this.attracted){
		var attractedX = this.attracted.x - this.x;
		var attractedY = this.attracted.y - this.y;
		var mag = Math.sqrt(attractedY*attractedY + attractedX*attractedX);
		attractedX /= mag;
		attractedY /= mag;
		attractedX *= 5000;
		attractedY *= 5000;
		future.acc.add(attractedX, attractedY);
	}

	if (inputs.left){
		if (Math.abs(future.speed.getX()) < this.maxSpeed){
			future.acc.add(-this.acce ,0);
		}
	}
	 if (inputs.right){
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
	
	if (inputs.up && !this.jumping && this.isOnGround()){
		future.speed.add(0,-700);
		this.jumping = true;
		this.jumpTime = 0;
	}	
	
	if (inputs.up && this.jumping && this.jumpTime < this.jumpInTime){
		this.jumpTime += delta * 1000;
		future.acc.add(0,-this.gravity);
	}
	else if (!inputs.up && this.jumping){
		this.jumpTime = 100000;
	}
	
	
	future.speed.add(future.acc.getX() * delta, future.acc.getY() * delta);
	future.loc.add(future.speed.getX() * delta, future.speed.getY() * delta);
	
	var onPlat = false;
	for (var i = 0; i < BG.ents.length; i++){
		var ent = BG.ents[i];

		if (isCollision(future.getRect(), ent)){ //COLLISION at new point

			
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


var hero = new Hero(); 


var T = new Timers();

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

addEventListener("mousedown", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
    var x = e.clientX - BG.xOff;
    var y = e.clientY - BG.yOff;
	if (!isRightMB){	
		for(var i = 0; i < BG.ents.length; i++){
			var curRect = BG.ents[i];
			if(x > curRect.x && x < curRect.x + curRect.width && y > curRect.y && y < curRect.y + curRect.height){
				hero.setAttraction(curRect);
				break;
			}	
		}
	}
}, false);

addEventListener("mouseup", function (e) {
    var isRightMB;
    e = e || window.event;


    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
	if (!isRightMB){
		hero.unAttract();
	}
	else{
		
	}
}, false);



// Update game objects
var update = function (modifier) {	
	var input = {left: false, right:false, up: false, shoot:false};
	if (38 in keysDown) { // Player holding up
		input.up = true;
	}
	if (32 in keysDown) { // Player holding down
		input.shoot = true;
		for (var i = 0; i < 30000000; i++){
			var abc = 100000;	
		}
	}
	if (37 in keysDown) { // Player holding left
		input.left = true;
	}
	if (39 in keysDown) { // Player holding right
		input.right = true;
	}
	
	hero.update(modifier, input);
	
	BG.update(-hero.x + canvas.width/2)
	
	T.update();
};

// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	//ctx.drawImage(AM.getAsset(BACK), 0, 0);
	
	hero.draw();
	
	BG.draw();
	
	// Score
	//ctx.fillStyle = "rgb(250, 250, 250)";
	//ctx.font = "24px Times";
	//ctx.textAlign = "left";
	//ctx.textBaseline = "top";
	//ctx.fillText("La siguiente fruta: ", 32, 32);	
};


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
		
	update(delta / 1000);

	render();

	then = now;
	requestAnimFrame(main, canvas);
};


var init = function(){		
	Hero.prototype.myImage = AM.getAsset(HERO);
	
	hero.sprite = hero.rotateAndCache(hero.myImage); 	

	then = Date.now();
		
	main();
}


var then = Date.now();
AM.downloadAll(init);
// Let's play this game!
