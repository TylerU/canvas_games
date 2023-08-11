function TouchStick(x, y){
	this.x = x;
	this.y = y;
	this.midX = x;
	this.midY = y;

	this.width = 75;
	this.actWidth = 200;
	this.renderType = "Circle";
	this.color = {r:100, g:100, b:100};

}

TouchStick.prototype.isMe = function(x, y){
	return (x > this.x - this.width/2 && x < this.x + this.width/2 && y > this.y - this.width/2 && y < this.y + this.width/2);
}


TouchStick.prototype.touchUpdate = function(x, y){
	// alert("X: " + x + " Y: " + y + " me: x: " + this.x + " y: " + this.y)
	// alert(this.isMe(x,y));
	if(this.isMe(x, y)){
		this.x = x;
		this.y = y;

		if(this.x > this.midX + this.actWidth/2 || this.x < this.midX - this.actWidth/2 || this.y > this.midY + this.actWidth/2 || this.y < this.midY - this.actWidth/2){
			this.x = this.midX;
			this.y = this.midY;
		}
	}
}

TouchStick.prototype.touchStart = function(x, y){
	if(this.isMe(x, y)){
		
	}
}

TouchStick.prototype.touchEnd = function(x, y){
	// if(this.isMe(x, y)){
		// this.x = this.midX;
		// this.y = this.midY;
	// }
}

TouchStick.prototype.draw = function(){
	RenderObject(this, ctx);
}

TouchStick.prototype.getAngle = function(){
	if(this.x == this.midX && this.y == this.midY){
		return -1;
	}
	else{
		return Math.atan2(this.y - this.midY, this.x - this.midX) + Math.PI;
	}
}