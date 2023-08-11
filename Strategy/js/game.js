

var WIDTH = 800;
var HEIGHT = 800;

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;




var AM = new AssetManager();
var SHIP = "images/shipl.png";
var ISLAND1 = "images/island2.png";
var BG = "images/bg.png";
var SMOKE = "images/smoke.png";

AM.queueDownload(SHIP);
AM.queueDownload(ISLAND1);
AM.queueDownload(BG);
AM.queueDownload(SMOKE);




// Handle keyboard controls
var keysDown = {};
var key_names = {
	87:"up",
	83:"down",
	65:"left",
	68:"right",
	38: "up_arrow",
	40: "down_arrow",
	37: "left_arrow",
	39: "right_arrow"
}

//TO DO:
//Update to use key_names
function input_change(key, value){
	if (key in key_names){
		keysDown[key_names[key]] = value;
	}
}


addEventListener("keydown", function (e) {
	if (!keysDown[key_names[e.keyCode]]){
		input_change(e.keyCode, true);
	}
}, false);

addEventListener("keyup", function (e) {
	input_change(e.keyCode, false);
}, false);


canvas.addEventListener("mousedown", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
	if (!isRightMB){
		selectRect.start(e.pageX, e.pageY);
		e.preventDefault();
	}
	else{
		e.preventDefault();
	}
}, false);

canvas.addEventListener("mouseup", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        
    if (!isRightMB){

		if(selectRect.end(e.pageX, e.pageY)){
			return;
		}
    	var pos = {x: e.clientX + cameraOffset.x, y: e.clientY + cameraOffset.y};4
    	var baseSelected = false;

		for(var i = 0; i < ents.length; i++){
			var ent = ents[i];
			if(ent.x-ent.width/2 < pos.x && ent.x+ent.width/2 > pos.x &&
			   ent.y-(ent.height || ent.width)/2 < pos.y && ent.y+(ent.height || ent.width)/2 > pos.y){
				if(ent.isBase){
					if(curPlayer==ent.player){
						setSelectedBase(ent);
						baseSelected = true;
					}
				}
			}
		}
		if(!baseSelected){
			if(getSelectedBase()){
				setSelectedBase(null);
			}
		}
	}
	else{
		e.preventDefault();
		for(var i = 0; i < selectRect.selected.length; i++){
			var ent = selectRect.selected[i];
			ent.moveTo(e.pageX + cameraOffset.x, e.pageY+ cameraOffset.y);
		}

	}

	UpdateUI();

}, false);


canvas.addEventListener("mousemove", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
	if (!isRightMB){	

		selectRect.move(e.pageX, e.pageY);
		return false;
	}

}, false);


canvas.oncontextmenu = function () {
   return false;
}




function SelectRect(){
	this.startX = 0;
	this.startY = 0;
	this.x = 0;
	this.y = 0;
	this.active = false;
	this.started = false;
	this.minActiveDist = 10;

	this.selected = [];
}
SelectRect.prototype.draw = function(ctx){
	var startX = this.startX - cameraOffset.x;
	var startY = this.startY - cameraOffset.y;
	if(this.active){
		ctx.strokeRect(Math.min(this.x, startX), Math.min(this.y, startY), Math.max(this.x, startX) - Math.min(this.x, startX), Math.max(this.y, startY) - Math.min(this.y, startY))
	}
}

SelectRect.prototype.start = function(x, y){
	this.x = x;
	this.y = y;
	this.startX = x + cameraOffset.x;
	this.startY = y + cameraOffset.y;
	this.started = true;
	this.active = false;
	this.selected = [];
}

SelectRect.prototype.end = function(x,y){
	this.move(x,y);
	var ret = false;
	if(this.started && this.active){
		ret = true;
	}
	this.started = false;
	this.active = false;

	for(var i = 0; i < ents.length; i++){
		var ent = ents[i];

		if(ent.x > Math.min(this.startX, this.x + cameraOffset.x) && ent.x < Math.max(this.startX, this.x + cameraOffset.x) && ent.y > Math.min(this.startY, this.y + cameraOffset.y) && ent.y < Math.max(this.startY, this.y + cameraOffset.y) ){
			if(ent.isShip){
				if(ent.player === curPlayer)
					this.selected.push(ent);
			}
		}
		else if(!ret && CollisionDetector.RectPointCollide(ent, {x: x + cameraOffset.x, y: y + cameraOffset.y})){
			if(ent.isShip){
				if(ent.player === curPlayer){
					ret = true;
					this.selected.push(ent);
				}
			}
		}
	}
	return ret;
}

SelectRect.prototype.getStartXOffset = function(){
	return this.startX - cameraOffset.x;
}
SelectRect.prototype.getStartYOffset = function(){
	return this.startY - cameraOffset.y;
}



SelectRect.prototype.move = function(x, y){
	if(this.started){
		this.x = x;
		this.y = y;
	}
	if(this.started && Dist(this.x, this.y, this.getStartXOffset(), this.getStartYOffset()) > this.minActiveDist){
		this.active = true;
	}
}



var selectRect = new SelectRect();

function CreateShip(base){
	if(base && base.isBase){
		if(base.money >= base.shipCost()){
			base.money -= base.shipCost();
			var newShip = new Ship(base.x, base.y, base.player);
			newShip.state = new ShipMoveToBaseState(newShip, base);
			ents.push(newShip);
		}
	}
}

var cameraOffset = {x: 0, y: 0};


var selectedBaseContainer = {base: null};
function getSelectedBase(){
	return selectedBaseContainer.base;
}
function setSelectedBase(base){
	selectedBaseContainer.base = base;
}



Base.prototype.isBase = true;
Base.prototype.shipCost = function(){
	return 50;
}
function Base(x, y, player){
	this.x = x;
	this.y = y;

	var width = RandomClampedInt(75,125);
	this.width = width;
	this.height = width;
	this.renderType = "Image";
	this.image = ISLAND1;
	this.useGivenSize = true;

	this.player = player;

	this.color = {r: 255, g: 0, b: 0};
	this.arc = {
		x : this.x,
		y : this.y,
		width : this.width * 2,
		lineWidth : this.width * .1,
		renderType : "CircleOutline",
		color : Clone(this.color)
	};
	this.arc.color.a = .5;

	this.timeBetweenMoneyGeneration = 5;
	this.timeSinceLastMoneyGeneration = this.timeBetweenMoneyGeneration;
	this.money = 0;
	this.moneyGenerated = 10;
}


Base.prototype.draw = function(ctx){
	RenderObject(this, ctx);
	if(this.selected()){
		RenderObject(this.arc);
	}
	RenderObject({
				renderType: "Rectangle",
				x: this.x - this.width/2 + 12,
				y: this.y - this.height/2 + 12,
				width: 10,
				height: 10,
				color: this.player.color
	}, ctx);
}

Base.prototype.selected = function(){
	return getSelectedBase()===this;
}

Base.prototype.update = function(delta){
	this.timeSinceLastMoneyGeneration += delta;
	if(this.timeSinceLastMoneyGeneration > this.timeBetweenMoneyGeneration){
		this.timeSinceLastMoneyGeneration = 0;
		this.money += this.moneyGenerated;
	}
}




/*Abstract parent class of all ship states. Defines the default state behavior.*/
function ShipAIState(ship){
	this.ship = ship;
}

ShipAIState.prototype.onMoveToBaseOrder = function(base){
	this.ship.state = new ShipMoveToBaseState(this.ship, base);
}

ShipAIState.prototype.onMoveToPointOrder = function(point){
	this.ship.state = new ShipMoveToPointState(this.ship, point);
}

ShipAIState.prototype.update = function(delta){

}




ShipIdleState.prototype = new ShipAIState();
ShipIdleState.prototype.constructor = ShipIdleState;

function ShipIdleState(ship){
	ShipAIState.call(this, ship);

	this.ship = ship;

	this.radius = 20;

	this.theta = RandomClamped(0, Math.PI*2);
	this.centerx = ship.x - this.radius * Math.cos(this.theta);
	this.centery = ship.y - this.radius * Math.sin(this.theta);
	this.orbitManager = new MoveInCirclesManager(this.ship, {x: this.centerx, y: this.centery}, this.ship.speed/4);
}

ShipIdleState.prototype.update = function(delta){
	this.orbitManager.update(delta);
}


ShipMoveToBaseState.prototype = new ShipAIState();
ShipMoveToBaseState.prototype.constructor = ShipMoveToBaseState;

function ShipMoveToBaseState(ship, base){
	ShipAIState.call(this, ship);

	this.ship = ship;
	this.targetBase = base;

	var angle = RandomClamped(0, Math.PI*2);
	var distFromBaseCenter = 60;

	var target = {x: base.x + distFromBaseCenter * Math.cos(angle), y: base.y + distFromBaseCenter*Math.sin(angle)};
	this.moveManager = new MoveToPointManager(ship, target);
}

ShipMoveToBaseState.prototype.update = function(delta){
	this.moveManager.update(delta);
	this.checkForArrival();
}

ShipMoveToBaseState.prototype.checkForArrival = function(){
	if(this.moveManager.hasArrived()){
		this.ship.state = new ShipOrbitBaseState(this.ship, this.targetBase);
	}
}





ShipMoveToPointState.prototype = new ShipAIState();
ShipMoveToPointState.prototype.constructor = ShipMoveToPointState;

function ShipMoveToPointState(ship, point){
	ShipAIState.call(this, ship);

	this.ship = ship;
	this.target = point;
	this.moveManager = new MoveToPointManager(ship, point);
}

ShipMoveToPointState.prototype.update = function(delta){
	this.moveManager.update(delta);
	this.checkForArrival();
}

ShipMoveToPointState.prototype.checkForArrival = function(){
	if(this.moveManager.hasArrived()){
		this.ship.state = new ShipIdleState(this.ship);
	}
}



ShipOrbitBaseState.prototype = new ShipAIState();
ShipOrbitBaseState.prototype.constructor = ShipOrbitBaseState;

function ShipOrbitBaseState(ship, base){
	ShipAIState.call(this, ship);

	this.ship = ship;
	this.base = base;
	this.orbitManager = new MoveInCirclesManager(this.ship, this.base, this.ship.speed/3);
}

ShipOrbitBaseState.prototype.update = function(delta){
	this.orbitManager.update(delta);
}



function MoveInCirclesManager(ent, center, speed){
	this.radius = Dist(ent.x, ent.y, center.x, center.y);
	this.theta = Math.atan2(ent.y - center.y, ent.x - center.x) + Math.PI*2;
	this.omega = speed / this.radius;
	this.ent = ent;
	this.center = center;
}

MoveInCirclesManager.prototype.update = function(delta){
	this.theta += this.omega * delta ; 
	this.ent.y = this.center.y + Math.sin(this.theta) * this.radius;
	this.ent.x = this.center.x + Math.cos(this.theta) * this.radius;
	this.theta %= (Math.PI * 2);
}


function MoveToPointManager(ent, target){
	this.ent = ent;
	this.target = target;
	this.refreshMovementDirection();
}

MoveToPointManager.prototype.update = function(delta){
	if(!this.hasArrived()){
		this.refreshMovementDirection();
		this.ent.x += this.dx * delta;
		this.ent.y += this.dy * delta;
	}
}

MoveToPointManager.prototype.hasArrived = function(){
	return (Math.abs(this.ent.x - this.target.x) < 1 && Math.abs(this.ent.y - this.target.y) < 1)
}

MoveToPointManager.prototype.refreshMovementDirection = function(){
	this.dx = this.target.x - this.ent.x;
	this.dy = this.target.y - this.ent.y;
	var mag = Dist(0,0, this.dx, this.dy);
	this.dx /= mag;
	this.dy /= mag;
	this.dx *= this.ent.speed;
	this.dy *= this.ent.speed;	
}




function GunController(source, timebetweenshots){
	this.timeBetweenShots = timebetweenshots;
	this.timeSinceLastShot = this.timeBetweenShots;
	this.source = source;
}

GunController.prototype.attemptToShootAt = function(entity){
	if(this.timeSinceLastShot >= this.timeBetweenShots){
		entity.getHit();
		CreateSmokeEffect(this.source.x, this.source.y);
		this.timeSinceLastShot = 0;
	}
}

GunController.prototype.update = function(delta){
	this.timeSinceLastShot += delta;
}


Ship.prototype.isShip = true;

function Ship(x,y, owner){
	this.x = x;
	this.y = y;

	this.width = 20;
	this.height = 20;
	this.renderType = "Image";
	this.image = SHIP;
	this.useGivenSize = true;

	this.orbitDist = 60;

	this.speed = 50;

	this.state = new ShipIdleState(this);

	this.player = owner;

	this.gun = new GunController(this, 1);

	this.health = 10;
	this.maxHealth = this.health;
}

Ship.prototype.draw = function(ctx){
	this.color = this.defaultColor;
	for(var e in selectRect.selected){
		if(selectRect.selected[e]===this){
			RenderObject({
				renderType: "Circle",
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
				color: {r: 255, g: 255, b: 0}
			},ctx);
		}
	}

	RenderObject({
				renderType: "CircleOutline",
				x: this.x,
				y: this.y,
				width: this.width*1.1,
				height: this.height*1.1,
				lineWidth: 2,
				color: this.player.color
	}, ctx);

	RenderObject({
				renderType: "Rectangle",
				x: this.x + this.width/2 + 5,
				y: this.y,
				width: 4,
				height: this.health/this.maxHealth * 20,
				color: {r:0, g:255, b:0}
	}, ctx);

	RenderObject(this, ctx);
}

Ship.prototype.update = function(delta){
	this.state.update(delta);
	this.gun.update(delta);
	var self = this;

	for(var i = 0; i < ents.length; i++){
		var ent = ents[i];
		if(ent.isShip){
			if(ent.player !== self.player){
				if(Dist(self.x, self.y, ent.x, ent.y) < 100){
					self.gun.attemptToShootAt(ent);
					break;
				}
			}
		}
	}
	if(this.health < 0)
		return true;
}

Ship.prototype.moveTo = function(x,y){
	var targetBase = null;
	var targetObj = {x:x, y:y};

	for(var i = 0; i < ents.length; i++){
		var ent = ents[i];
		if(ent.isBase){
			if(CollisionDetector.RectPointCollide(ent, targetObj)){
				targetBase = ent;
			}
		}
	}

	if(targetBase !== null){
		this.state.onMoveToBaseOrder(targetBase);
	}
	else{
		this.state.onMoveToPointOrder(targetObj);
	}
}

Ship.prototype.getHit = function(){
	this.health--;	
}




function Player(color){
	this.color = color;
}

Player.prototype.getColor = function(){
	return this.color;
}


function CreateSmokeEffect(x,y){
	ents.push(new TemporarySprite({x: x, y: y}, SMOKE, .5))
}

function TemporarySprite(position, image, time){
	this.timeRemaining = time;
	this.image = image;
	this.renderType = "Image";
	this.x = position.x; 
	this.y = position.y;
}

TemporarySprite.prototype.update = function(delta){
	this.timeRemaining -= delta;
	if(this.timeRemaining < 0)
		return true;//delete me
}

TemporarySprite.prototype.draw = function(ctx){
	RenderObject(this, ctx);
}
var ents = [];


// Update game objects
var update = function (modifier) {
	var moveAmt = 10;
	if(keysDown["up"] || keysDown["up_arrow"]){
		cameraOffset.y -= moveAmt;
	}
	else if(keysDown["down"] || keysDown["down_arrow"]){
		cameraOffset.y += moveAmt;
	} 

	if(keysDown["right"] || keysDown["right_arrow"]){
		cameraOffset.x += moveAmt;

	}
	else if(keysDown["left"] || keysDown["left_arrow"]){
		cameraOffset.x -= moveAmt;
	} 	


	for(var i = 0; i < ents.length; i++){
		if(ents[i].update(modifier)){
			ents.splice(i, 1);
		}
	}
};

// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	RenderObject({
		x: canvas.width/2,
		y: canvas.height/2,
		width: canvas.width,
		height: canvas.height,
		renderType: "Image",
		image: BG,
		useGivenSize: true
	}, ctx);
	ctx.save();
		ctx.translate(-cameraOffset.x, -cameraOffset.y);
		for(var i = 0; i < ents.length; i++){
			ents[i].draw(ctx, cameraOffset);
		}
	ctx.restore();

	selectRect.draw(ctx);
};


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	delta /= 1000;
	delta = delta.clamp(0, .5);
	update(delta);

	render();

	then = now;

	requestAnimFrame(main, canvas);
};


function UpdateUI(){
	angular.element($("#dashboard")).scope().$apply();
}

var player1 = new Player({r:255, g:0, b:0});
var player2 = new Player({r:0, g:0, b:255});
var curPlayer = player1;

var init = function(){
	$(function(){
		$("#canvasContainer").append(canvas);

		window.onresize = resize;	

		ents.push(new Base(100,100, player1));
		ents.push(new Base(200,300, player1));
		ents.push(new Base(400,500, player2));



		setInterval(function(){
			UpdateUI();
		}, 100);

		then = Date.now();
		
		main();
	})
}

function resize()
{
	//ctx.canvas.width  = window.innerWidth; 
	//ctx.canvas.height = window.innerHeight;
}



var animationsInProgress = 0;
function goHome(){
	if(animationsInProgress == 0){
		animationsInProgress = 1;
		$(cameraOffset).animate({x:0, y:0}, 1000, "easeInOutCubic", function(){animationsInProgress=0});
	}
}

var scope;


function DashboardController($scope, $rootScope){
	scope = $scope;
	
	$scope.shouldShowBaseControls = function(){
		return getSelectedBase() !== null;
	}

	$scope.tryToCreateShip = function(){
		CreateShip(getSelectedBase());
	}
	$scope.getCurrentMoney = function(){
		if(getSelectedBase())
			return getSelectedBase().money;
		else
			return "NOT AVAILABLE";
	}
	$scope.shouldShowShipSelectionControls = function(){
		return selectRect.selected.length > 0;
	}

	$scope.getSelectionProperties=function(){
		return selectRect.selected;
	}

	$scope.returnHome = function(){
		goHome();
	}
}




var then = Date.now();
AM.downloadAll(init);





// init();
// Let's play this game!
