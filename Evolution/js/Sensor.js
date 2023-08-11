// JavaScript Document

function Sensor(){
		
}

Sensor.prototype.numOutputs = 0;

Sensor.prototype.getOutput = function(organism, game){
	return 0;	
}


Sensor.prototype.onEachFood = function(food, game){
	
}

Sensor.prototype.onEachOrganism = function(mainOrg, otherOrg){
	
}

Sensor.prototype.resetMe = function(){
	
}



VecToFood.prototype = new Sensor();
VecToFood.prototype.constructor = VecToFood;
VecToFood.prototype.numOutputs = 1;

function VecToFood(){
	this.getOutput = function(organism, game){
		var closestfood = organism.closestFood;
		
		if (closestfood){		
			var angle = AngleBetween(organism.dx, organism.dy, closestfood.getX() - organism.getX(), closestfood.getY() - organism.getY());
			
			return angle;
		}
	}
}


MyHealth.prototype = new Sensor();
MyHealth.prototype.constructor = MyHealth;
MyHealth.prototype.numOutputs = 1;

function MyHealth(){
	this.getOutput = function(organism, game){	
		var hp =  organism.health / organism.maxHealth;
		
		return hp;
	}
}





ProximityEye.prototype = new Sensor();
ProximityEye.prototype.constructor = ProximityEye;
ProximityEye.prototype.theta = ToRadians(20);
ProximityEye.prototype.numOutputs = 3;

function ProximityEye(anAngle){
	this.myAngle = ToRadians(anAngle);
	this.currentClosest = null;
	
	this.getOutput = function(organism, game){	
		var out = [-1, -1, -1];
		if (this.currentClosest){//if we actually found one in our sight and everything
			var color = this.currentClosest.getColor();
			for (var i = 0; i < 3; i++){
				var input = color[i]/(255/2)-1  + .01;
				
				out[i] = input;
			}
		}
		
		return out; 
	}
	
	this.onEachOrganism = function(mainOrg, otherOrg){
		var dist = DistOptimized(mainOrg.getX(), mainOrg.getY(), otherOrg.getX(), otherOrg.getY());
		
		var dotProd = Dot( Math.cos(otherOrg.angle + this.myAngle), Math.sin(otherOrg.angle+this.myAngle), otherOrg.getX() - mainOrg.getX(), otherOrg.getY() - mainOrg.getY() );
		
		if (dotProd > Math.cos(this.theta)){//If this thing is within our sight range
			if (this.currentClosest !== null){
				var bestDist = DistOptimized(mainOrg.getX(), mainOrg.getY(), this.currentClosest.getX(), this.currentClosest.getY());
				
				if (dist < bestDist){
					this.currentClosest = otherOrg;
				}
			}
			else{
				this.currentClosest = otherOrg	
			}
		}
	}
	
	this.resetMe = function(){
		this.currentClosest = null;
	}
}