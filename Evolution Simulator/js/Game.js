// JavaScript Document
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
canvas.style.backgroundColor = "#308FE3";
document.body.appendChild(canvas);



var keysDown = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	if (e.keyCode == 13)		
		game.renderStuff = false;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
	if (e.keyCode == 13)
		game.renderStuff = true;
}, false);









function Game(food, orgs, render){
	this.numFood = food || 70;
	this.numOrgs = orgs || 60;

	if(render === undefined)
		this.renderStuff = true;
	else
		this.renderStuff = render;


	this.minOrganisms = 10;
	this.initialize();
}


Game.prototype.initialize = function(){
	this.organisms = [];
	this.food = [];
	this.entities = [];
	
	this.timeBetweenSpawns = 10000;//in ms
	this.timeBetweenFoodSpawns = 500;


	this.timers = new Timers();
	
	var thing = this;
	var call = function(){thing.createRandomOrganism(); thing.timers.add(call, thing.timeBetweenSpawns)};
	
	this.timers.add(call, this.timeBetweenSpawns);
	
	this.then = Date.now();
	
	this.fpsUpdateRate = 1;
	this.timeSinceLastFPSUpdate = 0;
	this.framesElapsed = 0;
	this.desiredFPS = 100;
	this.fps = 0;
	
	for (var i = 0; i < this.numFood; i++){
		this.createFood();	
	}
	
	for (var j = 0; j < this.numOrgs; j++){
		this.createRandomOrganism();
	}


	setInterval(function(){ thing.createFood(); }, this.timeBetweenFoodSpawns);
}

Game.prototype.resize = function(){
	
}

Game.prototype.update = function(){
	this.timers.update();
	
	var now = Date.now();
	var delta = now - this.then;
	delta = delta/1000;
	this.then = now;

	
	while (this.organisms.length < this.minOrganisms){
		this.createRandomOrganism();
	}

	for (var e = 0; e < this.entities.length; e++){
		var ent = this.entities[e];
		ent.update(delta);
		if (ent.remove){
			this.entities.splice(e,1);	
			if (ent instanceof Food){
				this.food.splice(this.food.indexOf(ent),1);
			}
			else if (ent instanceof Organism){
				this.organisms.splice(this.organisms.indexOf(ent),1);
			}
		}
	}

	this.updateGUIFields(delta);
}


Game.prototype.updateGUIFields = function(delta){
	this.timeSinceLastFPSUpdate += delta;
	this.framesElapsed += 1;
	
	if (this.timeSinceLastFPSUpdate > this.fpsUpdateRate){   
		this.fps = this.framesElapsed / this.timeSinceLastFPSUpdate;
		
		this.framesElapsed = 0; 
		this.timeSinceLastFPSUpdate = 0;
	}
}

Game.prototype.render = function(){
	ctx.clearRect(0,0,canvas.width, canvas.height);

	if (this.renderStuff){
		for (var e = 0; e < this.entities.length; e++){
			var ent = this.entities[e];
			ent.draw();
		}
	}
	
	ctx.font = 'italic 30px sans-serif';
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText(Math.floor(this.fps), 10,30);
}

Game.prototype.addFood = function(f){
	this.food.push(f);
	this.entities.push(f);
}

Game.prototype.addSplatter = function(s){
	this.entities.push(s);
	var thing = this;
	var call = function(){thing.removeSplatter(s)};
	
	this.timers.add(call, 5000);
}

Game.prototype.removeSplatter = function(s){
	this.entities.splice(this.entities.indexOf(s), 1);
}


Game.prototype.getFoodList = function(){
	return this.food;
}



Game.prototype.getOrganismList = function(){
	return this.organisms;
}




Game.prototype.addOrganism = function(o){
	this.organisms.push(o);
	this.entities.push(o);
}

Game.prototype.createFood = function(){
	this.addFood(new Food(RandomClamped(0,canvas.width), RandomClamped(0,canvas.height)));
}

Game.prototype.createRandomOrganism = function(){
	var g = new Genome(Genome.prototype.getNumSensors(),10,2);//TODO...fix function call and magic numbers
	var o = new Organism(this, RandomClamped(0,canvas.width), RandomClamped(0,canvas.height), g);
	this.addOrganism(o);
}


 Game.prototype.FindClosestFood = function(x, y){
	var best = null;
	
	var closestdist = 1000000000;
	
	for (var i in this.food){
		var curFood = this.food[i];
		var dist = Math.pow(curFood.getX()-x, 2) + Math.pow(curFood.getY() - y, 2);
		
		if (dist < closestdist){
			closestdist = dist;
			best = curFood;
		}
	}
	
	if (best !== null)
		return best;
	else
		console.log("PROB");
}



var game = new Game();


var update = function(){
	game.update();	
	window.setTimeout(update, 1000 / game.desiredFPS);
}

var render = function(){
	game.render();

	requestAnimFrame(render, canvas);		
}

update();
render();