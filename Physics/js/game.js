// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;
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
var BALL1 = "images/67.png";
var BALL2 = "images/68.png";
var TABLE = "images/table.png";
var CAR2 = "images/car1.png";
var CAR1 = "images/car2.png";
var ROAD = "images/road.jpg";

AM.queueDownload(BALL1);
AM.queueDownload(BALL2);
AM.queueDownload(TABLE);
AM.queueDownload(CAR1);
AM.queueDownload(CAR2);
AM.queueDownload(ROAD);

var modeElastic = true;
var currentBack = TABLE;

var elastic = function(b1, b2){//b1 must have a final speed
	var beginning = b1.initialSpeed * b1.mass + b2.initialSpeed * b2.mass;
	var ent2end = beginning - b1.finalSpeed * b1.mass;
	var ent2end = ent2end / b2.mass;
		
	b1.impulse(b1.finalSpeed);
	b2.impulse(ent2end);
}


var inelastic = function(b1, b2){
	var beginning = b1.initialSpeed * b1.mass + b2.initialSpeed * b2.mass;
	var ent2end = beginning / ( b1.mass  + b2.mass );
		
	b1.impulse(ent2end);
	b2.impulse(ent2end);
}

function typeChange(){
	var type = document.settings.type.value;
	if (type == "elastic"){
		document.getElementById("extra").style.visibility="visible";
		document.settings.m1.value = 170;
		document.settings.m2.value = 170;
		
		currentBack = TABLE;
		ents = balls;
		modeElastic = true;
	}
	else if (type == "inelastic"){
		document.getElementById("extra").style.visibility="hidden";		
		
		currentBack = ROAD;
		ents = cars;
		modeElastic = false;
		
		document.settings.m1.value = 1500;
		document.settings.m2.value = 1500;
	}
}

function m1Change(){
	ents[0].setMass(parseInt(document.settings.m1.value));
}

function m2Change(){
	ents[1].setMass(parseInt(document.settings.m2.value));	
}

function vi1Change(){
	ents[0].initialSpeed = parseInt(document.settings.vi1.value);		
}

function vf1Change(){
	ents[0].finalSpeed = parseInt(document.settings.vf1.value);		
}


function vi2Change(){
	ents[1].initialSpeed = parseInt(document.settings.vi2.value);			
}

function formSubmit(){
	if (document.getElementById("extra").style.visibility == "hidden")
	{
		startSim();
		
		var b1 = ents[0];
		var b2 = ents[1];
		var beginning = b1.initialSpeed * b1.mass + b2.initialSpeed * b2.mass;
		var ent2end = beginning / ( b1.mass  + b2.mass );
		
		document.getElementById("results").innerHTML = "Hello! SInce this was a perfectly inelastic collision, the cars effectively crashed into each other and got all comfortable and didn't want to leave. They got tangled up, resulting in a single EPIC object with a mass equal to the mass of each object added together.  Since they are now one object and don't plan on ending their relationship anytime soon, they also come out of the collision with the same velocity, which is equal to the momentum before the collision (m1v1 + m2v2) divided by the new mega mass (m1 + m2). In this case, the computed end velocty was " + ent2end + " pixels per second.";	
	}
	else
	{
		if (document.settings.vf1.value != ""){
			startSim();
			
			var b1 = ents[0];
			var b2 = ents[1];	
			var beginning = b1.initialSpeed * b1.mass + b2.initialSpeed * b2.mass;
			var ent2end = beginning - b1.finalSpeed * b1.mass;
			var ent2end = ent2end / b2.mass;
			
			document.getElementById("results").innerHTML = "Yo! Since this is an elastic collision, we needed the final velocity of one of the objects in order to figure out the end velocity of the other. This is because otherwise there are too many unknowns. We have no idea how fast the objects will be traveling after the collision except that the end momentum will add up to the same as the beginning momentum. Given that and one end velocity, we can figure out the velocity of the other object by subtracting the given object's end momentum (mv) from the total beginning momentum (m1v1 + m2v2) and dividing by the second object's mass. The computed end velocity in this simulation was " + ent2end + " pixels per second.";
		}
		else{ 
			alert("Please set an end velocity for object 1!");
		}
	}
}



Ball.prototype.image1 = BALL1;
Ball.prototype.image2 = BALL2;


function Ball(image, x1, y1, is) {
	this.x = x1;
	this.y = y1;
	
	this.origX = this.x;
	this.origY = this.y;
	
	this.imgNum = image;
	this.mass=170;
	this.initialSpeed=is;
	this.finalSpeed= null;
	this.scale = .1;
	this.vec = new Vec2(0,0);
}

Ball.prototype.setMass = function(m){
	this.mass = m;
	this.scale = m/1700;
}

Ball.prototype.getRadius = function(){
	return ((this.myImage.width )  * this.scale) / 2;
}

Ball.prototype.resetPos = function(){
	this.x = this.origX;
	this.y = this.origY;
}


Ball.prototype.update  = function(delta){	
	this.x+= this.vec.getX() * delta;
	this.y+= this.vec.getY() * delta;
}


Ball.prototype.impulse = function(x1){
	this.vec.setX(x1);
}

Ball.prototype.turn = function(){
	this.vec.setX(-this.vec.getX());	
}
Ball.prototype.getSpeed = function(){
	return this.vec.getX();	
}

Ball.prototype.draw = function(){ 
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.myImage, -this.myImage.width / 2*this.scale, -this.myImage.height / 2 * this.scale, this.myImage.width*this.scale, this.myImage.height*this.scale); 
		
		//ctx.beginPath();
		//ctx.arc(0, 0, this.getRadius(), 0, Math.PI*2, true); 
		//ctx.closePath();
		//ctx.fill(); 
				
	ctx.restore();
}







Car.prototype.image1 = CAR1;
Car.prototype.image2 = CAR2;


function Car(image, x1, y1, is) {
	this.x = x1;
	this.y = y1;
	
	this.origX = this.x;
	this.origY = this.y;
	
	this.imgNum = image;
	this.mass=1500;
	this.initialSpeed=is;
	this.finalSpeed= null;
	this.scale = .5;
	this.vec = new Vec2(0,0);
}

Car.prototype.setMass = function(m){
	this.mass = m;
	this.scale = m/3000;
}

Car.prototype.getRadius = function(){
	return ((this.myImage.width )  * this.scale) / 2;
}

Car.prototype.resetPos = function(){
	this.x = this.origX;
	this.y = this.origY;
}


Car.prototype.update  = function(delta){	
	this.x+= this.vec.getX() * delta;
	this.y+= this.vec.getY() * delta;
}


Car.prototype.impulse = function(x1){
	this.vec.setX(x1);
}

Car.prototype.turn = function(){
	this.vec.setX(-this.vec.getX());	
}
Car.prototype.getSpeed = function(){
	return this.vec.getX();	
}

Car.prototype.draw = function(){ 
	ctx.save(); 
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.myImage, -this.myImage.width / 2*this.scale, -this.myImage.height / 2 * this.scale, this.myImage.width*this.scale, this.myImage.height*this.scale); 
		
		//ctx.beginPath();
		//ctx.arc(0, 0, this.getRadius(), 0, Math.PI*2, true); 
		//ctx.closePath();
		//ctx.fill(); 
				
	ctx.restore();
}










// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var balls = [new Ball(1, canvas.width/10 * 2, canvas.height/2, 200), new Ball(2, canvas.width / 10 * 8, canvas.height/2, -200)];
var cars = [new Car(1, canvas.width/10 * 2, canvas.height/4*3, 200), new Car(2, canvas.width / 10 * 8, canvas.height/4*3, -200)];
var ents = cars;

// Update game objects

var startSim = function(){	
	ents[0].resetPos();
	ents[1].resetPos();
	ents[0].impulse(ents[0].initialSpeed);
	ents[1].impulse(ents[1].initialSpeed);	
}


var update = function (modifier) {	
	var b1 = ents[0];
	var b2 = ents[1];
	
	if (b1.x < 0 - b1.myImage.width*2 || b1.x > canvas.width + b1.myImage.width*2){
		b1.resetPos();
		b1.vec.revert();	
	}
	if (b2.x < 0 - b2.myImage.width*2  || b2.x > canvas.width + b2.myImage.width*2 ){
		b2.resetPos();
		b2.vec.revert();	
	}
	
	
	
	if ( (Math.abs(b1.x - b2.x)  - (b1.getRadius() + b2.getRadius())  )  < 0){		
		var depth = Math.abs(b1.x - b2.x)  - (b1.getRadius() + b2.getRadius()) ;
		
		/*if (ents == balls){
			b1.x+=depth/2;
			b2.x-=depth/2;
		}*/
		
		if (modeElastic)
			elastic(b1, b2);
		else
			inelastic(b1,b2);
			
	}
	
	b1.update(modifier);
	b2.update(modifier);
};

// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	ctx.drawImage(AM.getAsset(currentBack), 0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < ents.length; i++){
		ents[i].draw();
	}
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
	ents = balls;
	for (var i = 0; i < ents.length; i++){
		switch (ents[i].imgNum){
			case 1:
				ents[i].myImage = AM.getAsset(ents[i].image1);				
				break;
			case 2:
				ents[i].myImage = AM.getAsset(ents[i].image2);
				break;
		}
	}
	
	ents = cars;
	
	for (var i = 0; i < ents.length; i++){
		switch (ents[i].imgNum){
			case 1:
				ents[i].myImage = AM.getAsset(ents[i].image1);				
				break;
			case 2:
				ents[i].myImage = AM.getAsset(ents[i].image2);
				break;
		}
	}

	ents = balls;	
	then = Date.now();
		
	main();
}


var then = Date.now();
AM.downloadAll(init);
// Let's play this game!
