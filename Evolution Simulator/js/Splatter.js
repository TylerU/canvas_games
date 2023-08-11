// JavaScript Document

Splatter.prototype = new Entity();
Splatter.prototype.constructor = Splatter;




function Splatter (gamein, x, y, color, dirx, diry, power){
	this.x = x;
	this.y = y;
	
	this.sprite = this.rotateAndCache(200);
	this.drawOnCanvas(this.sprite.getContext("2d"), color, dirx, diry, power);
}

Splatter.prototype.drawOnCanvas = function (sprite, color, dirx, diry, power){
	sprite.save();
		sprite.translate(sprite.canvas.width/2, sprite.canvas.height/2);
		sprite.strokeStyle = "rgb(" + color[0] + "," + color[1] + "," +  color[2] + ")";
		sprite.clearRect(0,0,sprite.canvas.width, sprite.canvas.height);
		
		var mult = 15;
		var add = 15;
		for (var i = 0; i < 10; i++){
			sprite.moveTo(0,0);
			sprite.lineTo(dirx*mult + RandomClamped(-add,add), diry*mult + RandomClamped(-add,add))
		}
		
		sprite.stroke();
	sprite.restore();
}


Splatter.prototype.draw = function(){
	ctx.save();
		ctx.translate(this.x, this.y);
		ctx.drawImage(this.sprite, -(this.sprite.width/2), -(this.sprite.height/2));
	ctx.restore();
}