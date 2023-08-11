var WIDTH = 300;
var HEIGHT = 300;


var mainCanvasContainer = createCanvasContainer(WIDTH, HEIGHT);
document.body.appendChild(mainCanvasContainer.canvas);
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

function createCanvasContainer(width, height){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;
	return {
		canvas: canvas,
		ctx: ctx
	};
}

var AM = new AssetManager();
// var SHIP = "images/shipl.png";
// var ISLAND1 = "images/island2.png";
// var BG = "images/bg.png";
// var SMOKE = "images/smoke.png";

// AM.queueDownload(SHIP);
// AM.queueDownload(ISLAND1);
// AM.queueDownload(BG);
// AM.queueDownload(SMOKE);




// Handle keyboard controls
// var keysDown = {};
// var key_names = {
// 	87:"up",
// 	83:"down",
// 	65:"left",
// 	68:"right",
// 	38: "up_arrow",
// 	40: "down_arrow",
// 	37: "left_arrow",
// 	39: "right_arrow"
// }

// //TO DO:
// //Update to use key_names
// function input_change(key, value){
// 	if (key in key_names){
// 		keysDown[key_names[key]] = value;
// 	}
// }


// addEventListener("keydown", function (e) {
// 	if (!keysDown[key_names[e.keyCode]]){
// 		input_change(e.keyCode, true);
// 	}
// }, false);

// addEventListener("keyup", function (e) {
// 	input_change(e.keyCode, false);
// }, false);


// canvas.addEventListener("mousedown", function (e) {
//     var isRightMB;
//     e = e || window.event;

//     if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
//         isRightMB = e.which == 3; 
//     else if ("button" in e)  // IE, Opera 
//         isRightMB = e.button == 2; 
        	
// 	if (!isRightMB){
// 		e.preventDefault();
// 	}
// 	else{
// 		e.preventDefault();
// 	}
// }, false);

// canvas.addEventListener("mouseup", function (e) {
//     var isRightMB;
//     e = e || window.event;

//     if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
//         isRightMB = e.which == 3; 
//     else if ("button" in e)  // IE, Opera 
//         isRightMB = e.button == 2; 
        
//     if (!isRightMB){
		// }
// }, false);


// canvas.addEventListener("mousemove", function (e) {
//     var isRightMB;
//     e = e || window.event;

//     if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
//         isRightMB = e.which == 3; 
//     else if ("button" in e)  // IE, Opera 
//         isRightMB = e.button == 2; 
        	
// 	if (!isRightMB){	
// 		return false;
// 	}

// }, false);


// canvas.oncontextmenu = function () {
//    return false;
// }


var ents = [];


// Update game objects
var update = function (modifier) {
	for(var i = 0; i < ents.length; i++){
		var remove = ents[i].update(modifier);
		if(remove){
			ents.splice(i, 1);
		}
	}
};


function Particle(x, y, color){
	this.x = x;
	this.y = y;
	this.maxStartSpeed = 100;
	this.maxSpeed = 150;
	this.speed = new Vec2(RandomClamped(-this.maxStartSpeed,this.maxStartSpeed), RandomClamped(-this.maxStartSpeed,this.maxStartSpeed));
	this.acc = new Vec2(RandomClamped(-this.maxStartSpeed,this.maxStartSpeed),RandomClamped(-this.maxStartSpeed,this.maxStartSpeed));
	this.color = color;
	this.renderType = "Circle";
	this.width = 10;
}
Particle.prototype.update = function(delta){
	this.x += this.speed.getX() * delta;
	this.y += this.speed.getY() * delta;
	this.speed.add(this.acc.getX() * delta, this.acc.getY() * delta);
	this.speed.setX(this.speed.getX().clamp(-this.maxSpeed,this.maxSpeed));
	this.speed.setY(this.speed.getY().clamp(-this.maxSpeed,this.maxSpeed));
	if(this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT){
		return true;
	}
}
Particle.prototype.render = function(ctx){
	RenderObject(this, ctx);
}

// Draw everything
var render = function () {
	var ctx = mainCanvasContainer.ctx;
	var canvas = mainCanvasContainer.canvas;
	//ctx.clearRect(0,0, canvas.width, canvas.height);
	boxBlurCanvasRGB(canvas, 0, 0, canvas.width, canvas.height, 3)
	for(var i = 0; i < ents.length; i++){
		ents[i].render(ctx);
	}
};


// The main game loop
var main = function () {
    stats.begin();

	var now = Date.now();
	var delta = now - then;
	delta /= 1000;
	update(delta);

	render();

	then = now;

	requestAnimFrame(main, mainCanvasContainer.canvas);
	stats.end();
};



var init = function(){
	mainCanvasContainer.ctx.fillStyle = "black";
	mainCanvasContainer.ctx.fillRect(0,0,WIDTH,HEIGHT);
	// mainCanvasContainer.ctx.clearRect(0,0, mainCanvasContainer.canvas.width, mainCanvasContainer.canvas.height);

	setInterval(function(){
		ents.push(new Particle(WIDTH/2, HEIGHT/2, {r:RandomClampedInt(0,255), g:010
			, b:255}));
	}, 100);

	main();
}

function resize()
{
	//ctx.canvas.width  = window.innerWidth; 
	//ctx.canvas.height = window.innerHeight;
}




var then = Date.now();
// AM.downloadAll(init);


init();
