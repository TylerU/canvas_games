 // Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.left = '0px';
canvas.right = '0px';
canvas.style.zIndex = 1;
canvas.style.position = 'absolute';
document.body.appendChild(canvas);


var AM = new AssetManager();

//AM.queueDownload(ROCKET);

var ents = [];
var planets = [];
var stars = [];
var UIs = [];

var WORLD_SIZE = 3000;
var MIN_PLANET_DIST = 100;


Array.prototype.remove = function(set){return this.filter(
    function(e,i,a){return set.indexOf(e)<0}
)};

/*
var stats = ["Health","Armor","Damage","Speed"]

function test(arg){
	if (selectedPlanet.factoryStats !== undefined){
		selectedPlanet.factoryStats[arg.toLowerCase()] += 10;
	}
}

for (var i = 0; i < stats.length; i++){
	var myID = stats[i];
	$('#stat123').prepend("<p id='" + myID +  "'> " + myID + " <a href=''><img border = '0' id='image123' src='images/btn_upgrade.png' /></a> </p>") 
	$('#' + myID).click(function(e){
		test($(this).attr('id'));
		e.preventDefault();
		return false;
	});
}
*/	

function Ship(planetX, planetY, orbitDist, color){
	this.width = 20;
	this.height = 30;
	this.renderType = "Triangle";
	if (color){
		this.color = color;
	}else{
		this.color = {r:0,g:0,b:255};
	}
	
	this.target = {x:planetX, y:planetY};
	this.dir = new Vec2(0,0);
	this.curRot = 0;
	this.rot = 0;
	this.speed = 50;
	this.orbitDist = orbitDist + Math.floor(Math.random() * 20);
	this.x = planetX + this.orbitDist;
	this.y = planetY;
	
	this.health = 100;

	this.deltaRot = Math.asin(this.speed / this.orbitDist);
}

Ship.prototype.update = function(delta){
	//Find current rotation/look it up
	var curRot = this.curRot;
	this.deltaRot = Math.asin(this.speed / this.orbitDist);
	//Increment that rotation
	curRot = curRot + this.deltaRot  * delta;
	//Find new location
	var newLoc = {};
	var oldLoc = {};
	newLoc.x = Math.cos(curRot) * this.orbitDist;
	newLoc.y = Math.sin(curRot) * this.orbitDist;
	
	oldLoc.x = Math.cos(this.curRot) * this.orbitDist;
	oldLoc.y = Math.sin(this.curRot) * this.orbitDist;
	
	var chng = {};
	chng.x = newLoc.x - oldLoc.x;
	chng.y = newLoc.y - oldLoc.y;
	
	this.rot = curRot - Math.PI;
	
	this.x += chng.x;
	this.y += chng.y;
	this.curRot = curRot;
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
		ctx.fillRect(-this.width/2,-this.height/2, this.width, this.height);
	ctx.restore();		
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

function Star(x,y){
	this.x = x;
	this.y = y;
	this.moveDivider = RandomClampedInt(2,5);
	
	this.width = RandomClampedInt(1,3);
	this.renderType = "Rectangle"
	this.color = {r:255, g:255, b:255}
}

Star.prototype.update = function(delta){
	this.x = (this.x + canvas.width) % canvas.width;
	this.y = (this.y + canvas.height) % canvas.height;
}

function Planet(x,y){
	this.x = x;
	this.y = y;
	this.width = 30;
	this.renderType = "Circle";
	this.color = {r:RandomClampedInt(0,255), g:RandomClampedInt(0,255), b:RandomClampedInt(0,255)};


	this.factoryStats = {};

	this.factoryStats.speed = 1;
	this.factoryStats.health = 1;
	this.factoryStats.damage = 1;
	this.factoryStats.attackSpeed = 1;
	this.factoryStats.repairRate = 1;
}

Planet.prototype.createShip = function(){
	var s = new Ship(this.x, this.y, this.width + 20, this.color);
	s.speed = this.factoryStats.speed;
	s.health = this.factoryStats.health;

	ents.push(s);
};

// Handle keyboard controls
var keysDown = {};
var lastMousePos = {x:0, y:0}
var mouseDown = false;
var moved = false;
var moveTransform = {x:0,y:0}
var selectedPlanet = {};

window.oncontextmenu = function ()
{
    //showCustomMenu();
    return false;     // cancel default menu
}

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
        	
	if (!isRightMB){	
		mouseDown = true;
		moved = false;
		lastMousePos.x = e.clientX;
		lastMousePos.y = e.clientY;	
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
		mouseDown = false;
		var clickedPlanet = false;
		
		for (var i = 0; i < planets.length; i++){
			var p = planets[i];
			if (Dist(p.x, p.y, e.clientX, e.clientY) < p.width/2 && moved === false){
				console.log("COLLISION");
				clickedPlanet = true;
				//p.createShip();
				selectedPlanet = p;
				//UI.show();
				break;
			}
		}

		//if (clickedPlanet === false){
		//	selectedPlanet = {};
		//}
	}
	else{
		
	}
}, false);

addEventListener("mousemove", function (e) {
	if (mouseDown){
		//if (e.clientX !== lastMousePos.x && e.clientY !== lastMousePos.y){
			var delta = { x: e.clientX - lastMousePos.x, 
						  y: e.clientY - lastMousePos.y}
			
			var clmp = 100;
			delta.x = delta.x.clamp(-clmp,clmp);
			delta.y = delta.y.clamp(-clmp,clmp);
			
			moveTransform.x += delta.x;
			moveTransform.y += delta.y;
			
			lastMousePos.x = e.clientX;
			lastMousePos.y = e.clientY;	

			moved = true;
		//}
	}
}, false);



// Update game objects
var update = function (modifier) {	
	for (var i = 0; i < ents.length; i++){
		var e = ents[i]
		
		e.x += moveTransform.x / (e.moveDivider ? e.moveDivider : 1);
		e.y += moveTransform.y / (e.moveDivider ? e.moveDivider : 1);;
		
		if (e.update)
			e.update(modifier);	
			
	}
	
	for (var i = 0; i < UIs.length; i++){
		var ui = UIs[i]
		
		if (ui.update)
			ui.update(modifier);	
	}	
	
	moveTransform.x = 0;
	moveTransform.y = 0;
};

var RenderObject = function(rend, drawingContext){
	var currentCtx = (drawingContext !== undefined) ? drawingContext : ctx;

	if ( (rend.visible == undefined) ? true : rend.visible){
		currentCtx.save(); 
			currentCtx.translate(rend.x || rend.loc.getX(), rend.y || rend.loc.getY());
			currentCtx.rotate(rend.rot);
										
			var h = ((rend.height) ? rend.height : rend.width)/2;
			var w = rend.width/2;
			
			if (rend.color){
				var color = "rgb(" + rend.color.r + "," + rend.color.g + "," + rend.color.b + ")";
			}
			else{
				var color = "rgb(255,255,255)"//If no color is in the object, render it white	
			}
			
			switch (rend.renderType){
				case "Triangle":
					currentCtx.fillStyle = color;
					currentCtx.beginPath();  
					currentCtx.moveTo(w, h);  
					currentCtx.lineTo(-w,h);  
					currentCtx.lineTo(0,-h);  
					currentCtx.fill();							
					break;
				case "Rectangle":
					currentCtx.fillStyle = color;
					currentCtx.fillRect(-w,-h, w*2, h*2);
					break;
				case "Circle":
					currentCtx.beginPath();
					currentCtx.fillStyle = color;
					currentCtx.arc(0, 0, w, 0 , 2 * Math.PI, false);
					currentCtx.fill()
					break;
				case "Image":
					var asset = AM.getAsset(rend.image);
					currentCtx.drawImage(asset, -asset.width/2, -asset.height/2);//Draws at the image's size, not at the given size
					break;
				case "Sprite":
					var asset = rend.sprite;
					currentCtx.drawImage(asset, -asset.width/2, -asset.height/2);//Draws at the image's size, not at the given size
					break;
				case "Text":
					currentCtx.fillStyle = color;
					currentCtx.font = rend.font;
					currentCtx.fillText(rend.text, 0,0);
					//Draw Text
					break;
			}
		currentCtx.restore();
	}	
}

var selectionWidth = 50;
var selectionWidthBounds = [30,50];
var adder = .5;
var timeBetweenSectionWidthChanges = 2;
var timeSinceLastSWUpdate = 0;

// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	
	timeSinceLastSWUpdate ++;

	if (timeSinceLastSWUpdate > timeBetweenSectionWidthChanges){
		timeSinceLastSWUpdate = 0;
		selectionWidth += adder;
		if (selectionWidth >= selectionWidthBounds[1]){
			adder = -.5;
		}
		else if (selectionWidth <= selectionWidthBounds[0]){
			adder = .5;
		}
	}

	if (selectedPlanet.width !== undefined){
		ctx.beginPath();
		ctx.strokeStyle = "rgb(255,255,255)";
		selectionWidthBounds = [selectedPlanet.width * 2, selectedPlanet.width * 2 + 10];
		ctx.arc(selectedPlanet.x, selectedPlanet.y, selectionWidth, 0 , 2 * Math.PI, false);
		ctx.lineWidth = 15;
		ctx.stroke();
	}

	for (var i = 0; i < ents.length; i++){
		var rend = ents[i];
		
		RenderObject(rend);
	}
	
	for (var i = 0; i < UIs.length; i++){
		var rend = UIs[i];
		
		RenderObject(rend);
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

function AddPlanet(){
		var x = RandomClamped(0, canvas.width);
		var y = RandomClamped(0, canvas.height);
		var p = new Planet(x,y)
		ents.push(p);
		planets.push(p);	
}
						
var init = function(){
	resize();
    window.onresize = resize;

    CreateStars();
	
	//Create Planets
	for (var i = 0; i < 30; i++){
		AddPlanet();
	}

	CreateUpgradeButton(all_buttons[0], 1, "Make Ship", function(){selectedPlanet.createShip();});
	CreateUpgradeButton(all_buttons[1], 2, "Upgrade", function(){});
	CreateUpgradeButton(all_buttons[2], 3, "Upgrade");
	CreateUpgradeButton(all_buttons[3], 4, "Upgrade");

	UpdateButtons();
	Buttons.redraw();

	then = Date.now();

	main();
}

var all_buttons = ["test1","test2","test3","test4"];

var BUTTON_WIDTH = .15;
var BUTTON_HEIGHT = .1;
var SPACING_H = 20;

var CreateUpgradeButton = function(id, order, text, call){

   Buttons.addButton({
   		ID: id,
   		x: 1,
   		y: 1, 
   		width: 100,
   		height: 100,
   		color: {r: 255, g:0, b: 0},
   		renderType: "Rectangle",
   		
   		text: {
	   		x: 0 - canvas.width*BUTTON_WIDTH/2 + 3,
	   		y: 1, 
	   		color: {r: 255, g:255, b: 255},
	   		renderType: "Text",
	   		font: '15px Arial Bold',
	   		text: text
   		},
   		callback: call,
   });
}


var UpdateButtons = function(){
	for (var i = 0; i < all_buttons.length; i++){
		var order = i + 1;

		var w = canvas.width * BUTTON_WIDTH;
		var h = canvas.height * BUTTON_HEIGHT;

		var x = canvas.width - (canvas.width * BUTTON_WIDTH) / 2 - 10;
		var y = order * (h + SPACING_H*2) - SPACING_H; 

		var buttonObj = Buttons.getButton(all_buttons[i]);
		if (buttonObj){
			buttonObj = buttonObj.renderOpts;
			buttonObj.x = x;
			buttonObj.y = y;
			buttonObj.width = w;
			buttonObj.height = h;
			buttonObj.text.x = x - canvas.width*BUTTON_WIDTH/2 + 3;
			buttonObj.text.y = y;
		}
	}

}


var CreateStars = function(){
	//Create Stars
	for (var i = 0; i < 200; i++){
		var x = RandomClamped(-canvas.width, canvas.width * 2);
		var y = RandomClamped(-canvas.height, canvas.height * 2);	
		var s = new Star(x,y);
		ents.unshift(s);
		stars.push(s);
	}
}


function resize()
{
	ents = ents.remove(stars);
	stars = [];
	CreateStars();	
	ctx.canvas.width  = window.innerWidth; 
	ctx.canvas.height = window.innerHeight;
	Buttons.updateCanvasSize(window.innerWidth, window.innerHeight);
	UpdateButtons();
	Buttons.redraw();
}




var then = Date.now();
AM.downloadAll(init);
