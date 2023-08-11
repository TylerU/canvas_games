
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
