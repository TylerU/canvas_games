// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 584;
document.body.appendChild(canvas);

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

function Rect(x1,y1,width1,height1){
	this.x = x1;
	this.y = y1;
	this.width = width1;
	this.height = height1;
}

Rect.prototype.draw = function(x,y){
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.fillRect(-this.width/2,-this.height/2, this.width, this.height);
	ctx.restore();		
}

function BackGround() {
	this.ents = [new Rect(300,200,300,200), new Rect(500,450,2000,100), new Rect(800,200, 300,200)];	
	this.xOff = 0;
	this.yOff = 0;
}

BackGround.prototype.draw = function(){
	ctx.fillStyle = "rgb(255,0,255)"
	for (var i = 0; i < this.ents.length; i++){
		this.ents[i].draw(this.xOff, this.yOff);	
	}
}

BackGround.prototype.update = function(x,y){
	this.xOff = x;
	this.yOff = y;
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
	this.x = 800;
	this.y = canvas.height - canvas.height;
	this.maxSpeed = 200;
	this.acce = 2000;
	this.res = 150;
	this.gravity = 3000;
	this.jumping = false;
	this.lastUp = false;
	
	this.jumpInTime = 100;
	this.jumpTime=0;
	this.onPlatform = false;
}

Hero.prototype.isOnGround = function(){
	if (this.onPlatform){
		return true;	
	}
	else {
		return false;
	}
}


Hero.prototype.update  = function(delta, inputs){		
	var current = new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.sprite.width, this.sprite.height); //STAY! Read Only! I CONST...LEAVE IT ALONE
	var future =  new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.sprite.width, this.sprite.height); //MESS WITH MEEE
	
	future.acc.add(0,this.gravity); //WHOOSH. When this is added to velocity, we shall start going down.

	if (inputs.left){
		if (Math.abs(future.speed.getX()) < this.maxSpeed){
			future.acc.add(-this.acce ,0);
		}
	}
	 if (inputs.right){
		if (Math.abs(future.speed.getX()) < this.maxSpeed)
			future.acc.add(this.acce ,0);
	}
	
	if (Math.abs(current.speed.getX()) > 10){ //If we aren't 0
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
		future.speed.add(0,-500);
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
		//	document.getElementById('deb').innerHTML = "(" + future.loc.getX() + "," + future.loc.getY() + ") e (" + 
			future.getRect().width/2 + "," + future.getRect().height/2 + ")  ->  (" +
			ent.x + "," + ent.y + ") e (" +
			ent.width/2 + "," + ent.height/2 + ")  =  (" +
			depth.getX() + "," + depth.getY() + ")";
			
			//alert(depth.getX() + " " + depth.getY());
			
			if (Math.abs(depth.getX()) < Math.abs(depth.getY())){
				future.loc.setX(current.loc.getX() + depth.getX());
				future.speed.setX(0);
				future.acc.setX(0);			
			}
			else
			{
				future.loc.setY(current.loc.getY() + depth.getY());
				future.speed.setY(0);
				future.acc.setY(0);
				this.onPlatform = true;
				onPlat = true;
			}
		}
		else {						
			continue;
		}
	}
	if (onPlat == false){
		this.onPlatform = false;
	}

	   // Stroked triangle
	ctx.fillStyle = "rgb(255,0,255)"
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(current.loc.getX(),current.loc.getY());
	ctx.lineTo(current.loc.getX() + future.speed.getX()/5,current.loc.getY() + future.speed.getY()/5);
	ctx.closePath();
	ctx.stroke();
	
	this.vec = future.speed;
	this.x = Math.floor(future.loc.getX());
	this.y = Math.floor(future.loc.getY());
}


var hero = new Hero(); 


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



var T = new Timers();

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
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
			var abc = 0;	
		}
	}
	if (37 in keysDown) { // Player holding left
		input.left = true;
	}
	if (39 in keysDown) { // Player holding right
		input.right = true;
	}
	
	hero.update(modifier, input);
	
	BG.update(0,0)
	
	T.update();
};

// Draw everything
var render = function () {
	//ctx.clearRect(0,0, canvas.width, canvas.height);

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
