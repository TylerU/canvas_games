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
var fruitList = []; //Numbers of the fruits in the array below
var fruitNames = ["el platano", "la manzana", "la sandia", "la pera", "el champinon", "el tomate", "la zanahoria", "la cebolla", "los uvas", "el maiz"];
var numFruit = fruitNames.length;
var currentNum = 0;

var drawLevel = false;
var currentLevel = 1;
AM.queueDownload("images/space_nebula.jpg");
AM.queueDownload("images/Rocket-2.png");
AM.queueDownload("images/monster.png");
AM.queueDownload("images/Fruits.png");




function Timer(callback, now, time){
	this.call = callback;
	this.beginning = now;
	this.time = time;	
	this.done = false;
}

Timer.prototype.update = function(now){
	if (now > this.beginning + this.time){
		this.call();	
		this.done = true;
	}
}

function Timers(){
	this.timers = [];
}

Timers.prototype.update = function(){
	if (this.timers[0])	{
		for (var i = 0; i < this.timers.length; i++){
			this.timers[i].update(Date.now());	
			if (this.timers[i].done == true){
				this.timers.splice(i,1);	
			}
		}
	}
}

Timers.prototype.add = function(callback, time){
	this.timers.push(new Timer(callback, Date.now(), time));
}



function startLevel(level){
	currentNum = 0;
	
	fruits.length = 0;
	fruitList.length = 0;
		
	drawLevel = true;
	T.add(function(){drawLevel = false}, 1000);
	
	for (var i = 0; i < 1 + (level-1) * 2; i++){
		var num  = Math.floor(Math.random() * numFruit);
		fruitList[i] = num;
		fruits[i] = new Fruit(num) ;		
		fruits[i].x = Math.random() * canvas.width;
		fruits[i].y = Math.random() * canvas.height;		
		fruits[i].sprite = fruits[i].rotateAndCache(fruits[i].myImage);	
	}			
}



function resetFruit(extra, x, y, dist){	
	for (var i = currentNum - 1; i >= 0; i--){
		var vel = Math.random() * 50 + 400;
		var dir = Math.random() * 2 * Math.PI;
		
		
		var f = new Fruit(fruitList[i], dir, vel) ;	
		f.x = x + Math.cos(dir) * dist;
		f.y = y + Math.sin(dir) * dist;		
		f.sprite = f.rotateAndCache(f.myImage);	
		fruits.push(f);
	}
	
		var vel = Math.random() * 50 + 400;
		var dir = Math.random() * 2 * Math.PI;
		
		
		var f = new Fruit(extra, dir, vel) ;	
		f.x = x + Math.cos(dir) * dist;
		f.y = y + Math.sin(dir) * dist;		
		f.sprite = f.rotateAndCache(f.myImage);	
		fruits.push(f);
	
	currentNum = 0;
}


function makeSweetParticleFX(x,y, number){
	if (number >= 10){
		number = 0;	
	}
	else if (number <= 0){
		number = 1;	
	}
	
	for (var i = 0; i < number * 200; i++){
		var num = Math.floor(Math.random() * 100);
		pixels.push(new Particle({r: num, g: num, b: num}, Math.random() * 2 * Math.PI, Math.floor(Math.random() * 400), x, y , true, 6));
	}
}

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

Entity.prototype.wrap = function(){
	if (this.x < 0){
		this.x = canvas.width;	
	}

	if (this.x > canvas.width){
		this.x = 0;	
	}
	
	if (this.y < 0){
		this.y = canvas.height;	
	}

	if (this.y > canvas.height){
		this.y = 0;	
	}	
}

Entity.prototype.bounce = function(){
	if (this.x < 0){
		this.vec.setAngle(Math.atan2(this.vec.getNormY(),-this.vec.getNormX()));
		this.x = 0;
	}
	
	if (this.x > canvas.width){
		this.vec.setAngle(Math.atan2(this.vec.getNormY(),-this.vec.getNormX()));
		this.x = canvas.width;
	}
	
	if (this.y < 0){
		this.vec.setAngle(Math.atan2(-this.vec.getNormY(),this.vec.getNormX()));
		this.y = 0;	
	}

	if (this.y  > canvas.height){
		this.vec.setAngle(Math.atan2(-this.vec.getNormY(),this.vec.getNormX()));
		this.y = canvas.height;	
	}	
}

Hero.prototype = new Entity();
Hero.prototype.constructor = Hero; 
Hero.prototype.sprite = null; 
Hero.prototype.myImage = null;

function Hero() {
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;
	this.rot = 0;
	this.vec.setAngle(-Math.PI / 2);
	//this.dirFacing = -Math.PI / 2;
	this.dirFacing = 0;
	
	this.maxSpeed = 250;
	this.dRot = 5;

	//Physics
	this.acc = 12;
	this.airRes = this.acc/2;
}

Hero.prototype.update  = function(delta, inputs){
	Entity.prototype.update.call(this, delta);
	
	if (inputs.left){
		this.rot -= this.dRot * delta;
		this.dirFacing -= this.dRot * delta;
		this.updateCtx();
	}
	else if (inputs.right){
		this.rot += this.dRot * delta;
		this.dirFacing += this.dRot * delta;
		this.updateCtx();		
	}
	
	if (inputs.up){
		if (this.vec.getMag() < this.maxSpeed){
			var dirx = Math.cos(this.dirFacing)  * this.acc;
			var diry = Math.sin(this.dirFacing)  * this.acc;
			this.vec.add(dirx, diry);
		}
		
		for (var i = 0; i < 5; i++){
			pixels.push(new Particle({r: 255, g:  Math.floor(Math.random() * 150), b: Math.floor(Math.random() * 10)}, this.dirFacing - Math.PI - Math.PI / 8 + ((Math.PI / 4) * Math.random()), this.maxSpeed  - 40 + 40 * Math.random(), this.x  + Math.cos(this.dirFacing - Math.PI) * 18 , this.y + Math.sin(this.dirFacing - Math.PI) * 18  , true));
		}
	}
	else if (!inputs.up){	
	}
	
		
	if (this.vec.getMag() > this.airRes){ 
		this.vec.addToMag(-this.airRes);
	}
	else {
		this.vec.setMag(0);	
	}

	this.wrap();
}


var hero = new Hero(); 

Monster.prototype = new Entity();
Monster.prototype.constructor = Monster; 
Monster.prototype.myImage = null; 
Monster.prototype.sprite = null;

function Monster(){
	this.vec = new Vec2(Math.random() * 2 * Math.PI, 150);
	this.rot  = 0;
	var maxRotation  = 4;
	this.dRot = Math.random() * maxRotation * 2 - maxRotation;	
}

Monster.prototype.update = function(delta) {

	Entity.prototype.update.call(this, delta);

	this.rot += Math.PI/180 * this.dRot;
	this.updateCtx();		

	this.bounce();	
}

Monster.prototype.explode = function(angle, mag){
	this.updateCtx();		
	
	var ctx1 = this.sprite.getContext("2d");
	var imgd = ctx1.getImageData(0, 0, this.sprite.width, this.sprite.height);
	
	var pix = imgd.data;
	var dirs = [this.vec.getAngle(), angle];
	
	for (var i = 0; i < pix.length; i += 4) {
		if (!(pix[i+3] < 250) ){
			var oot = 1;
			
			if (mag < 1){
				oot = 0;	
			}
			
			var range = mag / 6 * Math.PI / 180;
			var direction = dirs[oot] + (Math.random() * range * 2) - range;
			var direction1 = dirs[oot] + (Math.random() * range * 2) - range;
			
			var speed = Math.random() * 170;
			var speed1 = Math.random() * 170;
			
			if (oot == 1){
				speed = speed / 150 * mag;
				speed1 = speed1 / 150 * mag;
			}
			
			var index  = i / 4;
			var row    = Math.floor(index / this.sprite.width);  
			var column = (index - row * this.sprite.width);
			
			var x1 = this.x - this.sprite.width/2 + column;
			var y1 = this.y - this.sprite.height/2 + row;
			pixels.push(new Particle({r: pix[i], g: pix[i+1], b: pix[i+2]}, direction, speed, x1 , y1, true));
			pixels.push(new Particle({r: 255, g: 0, b: 0},direction1, speed1, x1 , y1, true));
		}
	}
}






Fruit.prototype = new Entity();
Fruit.prototype.constructor = Fruit; 
Fruit.prototype.myImage = null; 
Fruit.prototype.sprite = null;

function Fruit(num, direction, initVel){
	var dir;
	var vel;
	this.maxVelocity = 150;
	
	if (direction){
		dir = direction;	
	}
	else {
		dir = Math.random() * 2 * Math.PI;	
	}
	
	if (initVel){
		vel = initVel;	
	}
	else {
		vel = this.maxVelocity;	
	}

	this.vec = new Vec2(dir, vel);
	this.airRes = 10;
	this.name = fruitNames[num];
	this.number = num; //may not be necessary...but makes for easy programming
	this.rot  = 0;
	var maxRotation  = 4;
	this.dRot = Math.random() * maxRotation * 2 - maxRotation;	
	this.imageSec = {x1: num*32, y1: Math.floor(num/10), width: 32, height: 32};	
}

Fruit.prototype.update = function(delta) {
	Entity.prototype.update.call(this, delta);
	
	if (this.vec.getMag() > this.maxVelocity){
		this.vec.addToMag(-this.airRes);	
	}
	
	this.rot += Math.PI/180 * this.dRot;
	this.updateCtx();		

	this.bounce();	
}

Fruit.prototype.rotateAndCache = function(image) {
	var offscreenCanvas = document.createElement('canvas');
	var offscreenCtx = offscreenCanvas.getContext('2d');

	var size = Math.sqrt(this.imageSec.width * this.imageSec.width  + this.imageSec.height * this.imageSec.height);
	offscreenCanvas.width = size;
	offscreenCanvas.height = size;
	
	offscreenCtx.save();
		offscreenCtx.translate(size/2, size/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(this.myImage, this.imageSec.x1, this.imageSec.y1, this.imageSec.width, this.imageSec.height, -this.imageSec.width/2, - this.imageSec.height/2, this.imageSec.width, this.imageSec.height);
	offscreenCtx.restore();
	
	return offscreenCanvas;
}


Fruit.prototype.updateCtx = function(){
	var offscreenCtx = this.sprite.getContext('2d');
	
	var size = Math.max(this.sprite.width, this.sprite.height);
	offscreenCtx.clearRect(0,0, size, size);

	offscreenCtx.save();
		offscreenCtx.translate(size/2, size/2);
		offscreenCtx.rotate(this.rot);
		offscreenCtx.drawImage(this.myImage, this.imageSec.x1, this.imageSec.y1, this.imageSec.width, this.imageSec.height, -this.imageSec.width/2, - this.imageSec.height/2, this.imageSec.width, this.imageSec.height);
	offscreenCtx.restore();
}


Fruit.prototype.toString = function(){
	return this.name;	
}
Fruit.prototype.explode = function(angle, mag){
	this.updateCtx();		
	
	var ctx1 = this.sprite.getContext("2d");
	
	var imgd = ctx1.getImageData(0, 0, this.sprite.width, this.sprite.height);
	
	var pix = imgd.data;
	var dirs = [this.vec.getAngle(), angle];
	
	for (var i = 0; i < pix.length; i += 4) {
		if (!(pix[i+3] < 250) ){
			var oot = 1;
			
			if (mag < 1){
				oot = 0;	
			}
			
			var range = mag / 6 * Math.PI / 180;
			var direction = dirs[oot] + (Math.random() * range * 2) - range;
			
			var speed = Math.random() * 150;
			
			if (oot == 1){
				speed = speed / 150 * mag;
			}
			
			var index  = i / 4;
			var row    = Math.floor(index / this.sprite.width);  
			var column = (index - row * this.sprite.width);
			
			var x1 = this.x - this.sprite.width/2 + column;
			var y1 = this.y - this.sprite.height/2 + row;
			pixels.push(new Particle({r: pix[i], g: pix[i+1], b: pix[i+2]}, direction, speed, x1 , y1));
		}
	}
}




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



var monstersCaught = 0;
var monsters = [];
var pixels = [];
var fruits = []; 
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
	}
	if (37 in keysDown) { // Player holding left
		input.left = true;
	}
	if (39 in keysDown) { // Player holding right
		input.right = true;
	}
	
	hero.update(modifier, input);

	for (var i = 0; i < monsters.length ; i++){
		monsters[i].update(modifier);
		if (
			hero.x <= (monsters[i].x + 32)
			&& monsters[i].x <= (hero.x + 32)
			&& hero.y <= (monsters[i].y + 32)
			&& monsters[i].y <= (hero.y + 32)
		) {
			++monstersCaught;
			monsters[i].explode(hero.vec.getAngle(), hero.vec.getMag());
				if (hero.vec.getMag() > hero.maxSpeed-5){
					time = Date.now();
				}
			
			monsters.splice(i,1);
		}
	}
	
	if (pixels[0]){
		for (var i = 0; i < pixels.length; i++){
			pixels[i].update(modifier);
			if (pixels[i].vec.getMag() <= 0 || pixels[i].x > canvas.width || pixels[i].x < 0 || pixels[i].y > canvas.height || pixels[i].y < 0) {
				pixels.splice(i,1);	
			}
		}
	}
	
	if (fruits[0]){
		for (var i = 0; i < fruits.length; i++){
			fruits[i].update(modifier);
			if (
				hero.x <= (fruits[i].x + 32)
				&& fruits[i].x <= (hero.x + 32)
				&& hero.y <= (fruits[i].y + 32)
				&& fruits[i].y <= (hero.y + 32)
			) 
			{
				fruits[i].explode(hero.vec.getAngle(), hero.vec.getMag());
				
				if (fruits[i].name == fruitNames[fruitList[currentNum]])
				{
					currentNum++;	
					fruits.splice(i,1);
					if (!fruits[0]){
						currentLevel++;
						startLevel(currentLevel);	
					}
				}
				else if (!(fruits[i].name == fruitNames[fruitList[currentNum]]))
				{
					var num = fruits[i].number;
					fruits.splice(i,1);
					makeSweetParticleFX(hero.x, hero.y, currentNum);					
					resetFruit(num, hero.x, hero.y, hero.sprite.width * 1.4);
				}
			
			}
		}		
	}
	
	T.update();
	
};

// Draw everything
var render = function () {
	ctx.drawImage(AM.getAsset("images/space_nebula.jpg"), 0, 0);
	
	hero.draw();
	
	for (var i = 0; i < monsters.length; i++){
		monsters[i].draw();
	}
	
	if (pixels[0]){
		for (var i = 0; i < pixels.length; i++){
			pixels[i].draw()
		}
	}
	
	if (fruits[0]){
		for (var i = 0; i < fruits.length; i++){
			fruits[i].draw();
		}		
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("La siguiente fruta: " + fruitNames[fruitList[currentNum]], 32, 32);	
	
	if (drawLevel == true){
		ctx.font = "60px Helvetica";
		ctx.fillText("LEVEL " + currentLevel, canvas.width / 8 * 3, canvas.height / 8 * 3);		
	}
};


var time = 0;
var timeToSlow = 200;
// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	if (now < time + timeToSlow){
		delta = delta / 4;
	}
	else if (now < time + timeToSlow * 2){
		delta = delta / 2;
	}
	else if (now < time + timeToSlow * 3){
		delta = delta / 1.3;	
	}
	
	update(delta / 1000);

	render();

	then = now;
	
	requestAnimFrame(main, canvas);
};


var init = function(){	
	Monster.prototype.myImage = AM.getAsset("images/monster.png");		
	Fruit.prototype.myImage = AM.getAsset("images/Fruits.png");
	
	for (var i = 0; i < 5; i++){
		monsters[i] = new Monster();
		monsters[i].x = Math.random() * canvas.width;
		monsters[i].y = Math.random() * canvas.height;		
		monsters[i].sprite = monsters[i].rotateAndCache(monsters[i].myImage);	
	}	
	
	startLevel(currentLevel);
	
	Hero.prototype.myImage = AM.getAsset("images/Rocket-2.png");
	hero.sprite = hero.rotateAndCache(hero.myImage); 	
		
	then = Date.now();
	
	main();
}

var then = Date.now();
AM.downloadAll(init);
// Let's play this game!
