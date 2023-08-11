var MAP_SIZE = 800;


var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = MAP_SIZE;
canvas.height = MAP_SIZE;

document.body.appendChild(canvas);


Number.prototype.clamp = function(min, max) {
  	 return Math.min(Math.max(this, min), max);
};


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
//var BG = new core.BackGround();
var BIRD = "images/Overworld_Sprites__Birds_by_RubyDragonCat.png";
var STATUE = "images/statue1.png";

AM.queueDownload(BIRD);
AM.queueDownload(STATUE);


var keysDown = {};
var nextTarget = {};
var mousePos = {x:0, y:0};
var mouseDown = false;


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
	}

}, false);

addEventListener("mousemove", function (e) {
	mousePos.x = e.pageX;
	mousePos.y = e.pageY;
}, false);



var RenderObject = function(rend, drawingContext){
	var currentCtx = (drawingContext !== undefined) ? drawingContext : ctx;

	if ( (rend.visible == undefined) ? true : rend.visible){
		currentCtx.save(); 
			if (rend.x != undefined && rend.y != undefined)
				currentCtx.translate(rend.x, rend.y);
			else if (rend.loc != undefined)
				currentCtx.translate(rend.loc.getX(), rend.loc.getY());
			else
				console.log("ERROR: No valid location to draw object");

			currentCtx.rotate(rend.rot);
			currentCtx.scale( rend.flip ? -1 : 1,1);			
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
					currentCtx.fill();
					break;
				case "Image":
					var asset = AM.getAsset(rend.image);
					currentCtx.drawImage(asset, -asset.width/2, -asset.height/2);//Draws at the image's size, not at the given size
					break;
				case "Text":
					currentCtx.fillStyle = color;
					currentCtx.font = rend.font;
					currentCtx.fillText(rend.text, 0,0);
					//Draw Text
					break;
				case "Sprite":
					var asset = AM.getAsset(rend.image);
					currentCtx.drawImage(asset, rend.curFrame.x, rend.curFrame.y, rend.spriteWidth, rend.spriteHeight, -rend.spriteWidth/2, -rend.spriteHeight/2, rend.spriteWidth*(rend.scale || 1), rend.spriteHeight*(rend.scale || 1));//Draws at the image's size, not at the given size
					break;
			}
		currentCtx.restore();
	}	
};











var ents = [];





var Statue = function(x){
	this.x = x;

	this.renderType = "Image";
	this.image = STATUE;

	var img = AM.getAsset(this.image);
	this.width = img.width;
	this.height = img.height;

	this.y = ctx.canvas.height - img.height/2;

	this.gunLoc = {x:0, y:-45};
	this.gunAngle = 0;
	this.gunLength = 100;
	this.input= {};

	this.timeBetweenShots = .5;
	this.timeSinceLastShot = 0;
};

Statue.prototype.update = function(delta){
	this.timeSinceLastShot += delta;

	if(this.input.mousePos){
		this.gunAngle = Math.atan2(this.input.mousePos.y - this.y - this.gunLoc.y, this.input.mousePos.x - this.x - this.gunLoc.x);
	}

	if(this.input.mouseDown && this.timeSinceLastShot > this.timeBetweenShots){
		this.timeSinceLastShot = 0;
		for(var i = 0; i < 1; i++){
			//var div = 20;
			//var angle = this.gunAngle + RandomClamped(-Math.PI/div,Math.PI/div);
			var angle = this.gunAngle;
			ents.push(new Bullet(this.x + this.gunLoc.x, this.y+this.gunLoc.y, Math.cos(angle), Math.sin(angle)))
		}
	}
	return false;
};

Statue.prototype.draw = function(){
	RenderObject(this, ctx);

	ctx.save();
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.lineWidth = 10;
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.moveTo(this.gunLoc.x, this.gunLoc.y);
	    ctx.lineTo(this.gunLoc.x + Math.cos(this.gunAngle) * this.gunLength, this.gunLoc.y + Math.sin(this.gunAngle) * this.gunLength);
	    ctx.stroke();
	ctx.restore();

};

Statue.prototype.poopQuery = function(x,y){
	if(x > this.x-this.width/2 && x < this.x + this.width/2 && y > this.y-this.height/2 && y < this.y + this.height/2 ){
		return true;
	}
}








var Bullet = function(x, y, dirx, diry){
	this.y = y;
	this.x = x;

	this.dirx = dirx;
	this.diry = diry;

	this.speed = 1700;

	this.renderType = "Rectangle";
	this.width = 10;
	this.color = {r: 0, g:0, b:255};
};

Bullet.prototype.update = function(delta){
	//alert("here");
	this.x += this.dirx * this.speed * delta;
	this.y += this.diry * this.speed * delta;

	if(this.x < 0 || this.y > MAP_SIZE || this.x > MAP_SIZE || this.y < 0){
		return true;
	}

	for(var i = 0; i < ents.length; i++){
		var e = ents[i];

		//if(this.x > e.x-e.width/2 && this.x < e.x + e.width/2 && this.y > e.y-e.height/2 && this.y < e.y + e.height/2 ){
		if(RectSegCollide(e, this.x, this.y, this.x - this.dirx * this.speed * delta, this.y - this.diry * this.speed * delta)){
			if(typeof e.hit === 'function'){
				if(e.hit()){
					return true;
				}
			}
		}
	}
};

Bullet.prototype.draw = function(){
	RenderObject(this, ctx);
};



var RayCastBullet = function(x, y, dirx, diry){
	var range = ctx.canvas.height * 2;
	var angle = Math.atan2(diry, dirx);

	this.x = x;
	this.y = y;
	this.endX = x + Math.cos(angle) * range;
	this.endY = y + Math.sin(angle) * range;
	this.timeAlive = 0;

	this.life = .1;

	for(var i = 0; i < ents.length; i++){
		var e = ents[i];

		if(RectSegCollide(e, this.x, this.y, this.endX, this.endY)){
			if(typeof e.hit === 'function'){
				e.hit();
			}
		}
	}
};

RayCastBullet.prototype.update = function(delta){
	this.timeAlive += delta;

	if(this.timeAlive > this.life)
		return true;
	else
		return false;
};

RayCastBullet.prototype.draw = function(){
	ctx.save();
		ctx.strokeStyle = "rgb(255,0,0)";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
	    ctx.lineTo(this.endX, this.endY);
	    ctx.stroke();
	ctx.restore();
};






var Poop = function(x, y, dirx, diry, gravity){
	this.y = y;
	this.x = x;

	this.gravity = gravity;
	this.dirx = dirx;
	this.diry = diry;

	this.renderType = "Rectangle";
	this.width = 6;
	this.color = {r: 0, g:255, b:0};
};

Poop.prototype.update = function(delta){
	//alert("here");
	this.diry += this.gravity * delta;
	this.x += this.dirx * delta;
	this.y += this.diry * delta;


	for(var i = 0; i < ents.length; i++){
		var en = ents[i];
		if(en instanceof Statue){
			//FIND A BETTER WAY TO DO THIS
			if(en.poopQuery(this.x, this.y))
				return true;
		}
	}
	if(this.x < 0 || this.y > MAP_SIZE || this.x > MAP_SIZE || this.y < 0){
		return true;
	}
};

Poop.prototype.draw = function(){
	RenderObject(this, ctx);
};






var PhysicsState = function(locX, locY, vecX, vecY, accX, accY, w, h) {
	this.loc = new Vec2(locX, locY);
	this.speed = new Vec2(vecX, vecY);
	this.acc = new Vec2(accX, accY);
	this.size = new Vec2(w,h);
	this.getRect = function(){
		return new core.Rect(this.loc.getX(), this.loc.getY(), this.size.getX(), this.size.getY());
	}
}


var Character = function(){
	this.x = 100;
	this.y = 100;

	this.hp = 1;

	this.vec = new Vec2(0,0);
	this.gravity = 500;
	
	this.maxSpeed = 360;

	this.acce = 2000;


	this.dRot = Math.PI/2;
	this.rot = 0;

	this.beatTime = .3;
	this.beatTimer = 0;

	//Render Options:
	this.renderType = "Sprite";
	this.image = BIRD;
	this.flip = false;


	this.frames = [{
		x: 39,
		y: 10
	},
	{
		x: 71,
		y: 9
	},
	{
		x: 107,
		y: 10
	},
	{
		x: 138,
		y: 11
	}];

	this.curFrame = this.frames[0];

	this.spriteWidth = 27;
	this.spriteHeight = 23;

	this.width = this.spriteWidth;
	this.height = this.spriteHeight;

	this.timeBetweenShots = .25;
	this.timeSinceLastShot = 0;

};

Character.prototype.draw = function(drawCtx){
	RenderObject(this, drawCtx);
	//ctx.strokeRect(this.x - this.width/2, this.y-this.height/2, this.width, this.height);
};


Character.prototype.update = function(delta){
	this.beatTimer += delta;
	this.timeSinceLastShot += delta;

	this.beatTimer %= (this.beatTime * 2);
	//console.log(this.beatTimer);

	var current = new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.width || this.sprite.width, this.height || this.width || this.sprite.height); //STAY! Read Only! I CONST...LEAVE IT ALONE
	var future =  new PhysicsState(this.x,this.y, this.vec.getX(), this.vec.getY(), 0,0, this.width || this.sprite.width, this.height || this.width || this.sprite.height); //MESS WITH MEEE
	
	future.acc.add(0,this.gravity); //WHOOSH. When this is added to velocity, we shall start going down.
	
	if(this.hp > 0){
		//Shooting
		if(this.input.shoot && this.timeSinceLastShot > this.timeBetweenShots){
			this.timeSinceLastShot = 0;
			ents.push(new Poop(this.x, this.y + 10, this.vec.getX(), this.vec.getY(), this.gravity));
		}


		//Set current frame
		if(this.input.up)
			this.curFrame = this.frames[Math.floor(this.beatTimer / (this.beatTime*2) * this.frames.length)];
		else
			this.curFrame = this.frames[1];


		//Add to horizontal speed
		/*if (this.input.right){
			future.acc.add(this.acce * delta, 0);
		}
		else if(this.input.left){
			future.acc.add(-this.acce * delta, 0);
		}

		//Stop falling down really fast
		if(future.speed.getY() > 100 && !this.input.down){//Going down really fast
			future.acc.add(0, -this.gravity*2);//Make us glide - mitigate gravity
		}

		//Visual: going down
		if(this.input.down){
			this.rot = Math.PI * .1;
		}
		else{
			this.rot = 0;
		}

		//Apply upward forces
		if(this.input.up){//Go up
			//console.log("Beat")
			var max_add = 1.8;
			var min_add = .5;
			var net_add = max_add - min_add;

			var this_add = min_add + (this.beatTime - Math.abs(this.beatTime - this.beatTimer))/this.beatTime*net_add;
			//console.log(this_add);
			future.acc.add(0, -this.gravity*this_add);
		}
		else if(this.input.down){//Dive
			
		}
		else{//Glide
			if(future.speed.getY() > 0){//Going down slowly
				future.acc.add(0, -this.gravity*.95);//Make us glide - mitigate gravity
			}
			else{
				future.acc.add(0, -this.gravity*.6);//Mitigate less gravity since we are moving up
			}
		}*/

		if(this.input.right){
			if(this.rot < Math.PI/2){
				this.rot += this.dRot * delta;
			}
			else{
				this.flip = !this.flip;
				this.rot = -Math.PI/2;
			}
		}
		else if(this.input.left){
			if( this.rot > Math.PI/-2 ){
				this.rot -= this.dRot * delta;
			}
			else{
				this.flip = !this.flip;
				this.rot = Math.PI/2;
			}
		}


		if(future.speed.getY() > 30){//Going down slowly
			var distFromHorizon = Math.min(Math.abs(this.rot-Math.PI/2), Math.PI/2) / (Math.PI/2) + .25;
			if(this.flip){
				distFromHorizon = Math.min(Math.abs(this.rot+Math.PI/2), Math.PI/2) / (Math.PI/2) + .25;
			}
			future.acc.add(0, -this.gravity*distFromHorizon);//Make us glide - mitigate gravity
		}

		if(this.input.up){
			var max_add = 1.8;
			var min_add = .8;
			var net_add = max_add - min_add;

			var this_add = min_add + (this.beatTime - Math.abs(this.beatTime - this.beatTimer))/this.beatTime*net_add;
			this_add *= this.gravity;

			future.acc.add(this_add * Math.cos(this.rot - Math.PI/2), this_add * Math.sin(this.rot - Math.PI/2));
		}
		//else{

		//}
	}
	else{
		this.curFrame = this.frames[0];
		this.rot = Math.PI*7/4;

		if(this.y > ctx.canvas.height){
			return true;
		}
	}

	//Integrate!
	future.speed.add(future.acc.getX() * delta, future.acc.getY() * delta);

	future.loc.add(future.speed.getX() * delta, future.speed.getY() * delta);

	var dx = future.loc.getX() - current.loc.getX();
	var dy = future.loc.getY() - current.loc.getY();

	dx = dx.clamp(-this.maxSpeed * delta, this.maxSpeed * delta);
	dy = dy.clamp(-this.maxSpeed * 2 * delta, this.maxSpeed * 2 * delta);

	this.vec.setX(dx/delta);
	this.vec.setY(dy/delta);

	//Integrate
	this.x = (current.loc.getX() + dx);
	this.y = (current.loc.getY() + dy);


	//Loop around
	this.x += ctx.canvas.width;
	this.x %= ctx.canvas.width;
	//this.y += ctx.canvas.height;
	//this.y %= ctx.canvas.height;	
};

Character.prototype.hit = function(){
	this.hp -= 1;

	if(this.hp <= 0){
		this.vec.add(0, -200);
	}

	if(this.hp < 0){
		return false;
	}
	else{
		return true;
	}
}


AICharacter.prototype = new Character();
AICharacter.prototype.constructor=AICharacter;

function AICharacter(a_y){
	Character.call(this);

	this.input = {up: false, down:false, left:false, right:false, shoot:false};

	this.y = RandomClamped(-100, -10);
	this.x = RandomClamped(0, ctx.canvas.width);
	this.y_min = 100;
	this.y_max = a_y || 200;

	this.rot = Math.PI/10;
	if(Math.random() > .5){
		this.flip = true;
		this.rot = -this.rot;
	}

	this.timeUntilSwitch = 1.0;

}


AICharacter.prototype.update = function(delta){
	this.timeUntilSwitch -= delta;

	if(this.timeUntilSwitch < 0){
		this.input.up = !this.input.up;

		if(this.y > this.y_max){
			this.input.up = true;
		}
		else if(this.y < this.y_min){
			this.input.up = false;
		}

		if(this.input.up)
			this.timeUntilSwitch = RandomClamped(.3, .5);
		else
			this.timeUntilSwitch = RandomClamped(.5, 2.5);
	}

	var chance = .01;
	if(this.input.shoot){
		chance = .1;
	}

	if(Math.random() < chance){
		this.input.shoot = !this.input.shoot;
	}

	return Character.prototype.update.call(this, delta);
}

var user = {};
var user1 = {};




// Update game objects
var update = function (modifier) {	
	var input = {left: false, right:false, up: false, down:false, shoot:false, mousePos:mousePos, mouseDown:mouseDown};
	

	if (38 in keysDown) { // Player holding up
		input.up = true;
	}
	if (40 in keysDown) { // Player holding down
		input.down = true;
	}
	if (37 in keysDown) { // Player holding left
		input.left = true;
	}
	if (39 in keysDown) { // Player holding right
		input.right = true;
	}
	if(32 in keysDown){
		input.shoot = true;
	}
	
	user.input = input;
	user1.input = input;

	user.update(modifier);
	for(var i = 0; i < ents.length; i++){
		if(ents[i].update(modifier)){
			ents.splice(i,1);
		}
	}
};

// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	for(var i = 0; i < ents.length; i++){
		ents[i].draw();
	}	

	user.draw();
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
	window.onresize = resize;	

	then = Date.now();

	user = new Statue(ctx.canvas.width/2);

	user1 = new Character();
	ents.push(user1);
	
	for(var i = 0; i < 20; i++){
		ents.push(new AICharacter(RandomClamped(150, ctx.canvas.height/3*2)));
	}
	
	main();
}

function resize()
{
	//ctx.canvas.width  = window.innerWidth; 
	//ctx.canvas.height = window.innerHeight;
}



var then = Date.now();
AM.downloadAll(init);
//init();
// Let's play this game!
