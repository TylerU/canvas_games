// JavaScript Document
Food.prototype.width = 2;

Food.prototype = new Entity();
Food.prototype.constructor = Food; 

Food.prototype.radius = 5;

function Food (x,y){
	this.setX(x);
	this.setY(y);
}

Food.prototype.draw = function() {
	ctx.beginPath();
	ctx.arc(Math.floor(this.getX()), Math.floor(this.getY()), Math.floor(this.radius), 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fillStyle = "rgb(0,255,0)";
	ctx.fill();
}

Food.prototype.update = function(delta) { 	}

