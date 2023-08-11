 // Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var bloodCanvas = document.createElement("canvas");
var bloodCtx = bloodCanvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.left = '0px';
canvas.style.top = '0px';

bloodCanvas.width = window.innerWidth;
bloodCanvas.height = window.innerHeight;
bloodCanvas.style.position = 'absolute';
bloodCanvas.style.left = '0px';
bloodCanvas.style.top = '0px';

//document.body.appendChild(bloodCanvas);
document.body.appendChild(bloodCanvas);
document.body.appendChild(canvas);


var AM = new AssetManager();

AM.queueDownload("images/speed_upgrade.png");

var ents = [];

var ZOMBIECOLOR = {
			r: 0,
			g: 108,
			b: 0,
};

var ZOMB_SPEED_BONUS = 0;

function applyUpgrade(isHuman, statCall, value){
	for (var i = 0; i < ents.length; i++){
		var ent = ents[i];

		if (ent.isHuman() === isHuman){
			if (ent[statCall]){
				ent[statCall](value);
			}
		}
	}
};


/*
function CreateBloodSplatter(x, y, dir, width){
	//Private variables
	var _removeTime = Date.now() + 10000;
	//End Private Variables

	var obj =  {
		//Public Variables and functions
		loc: new Vec2(x, y),
		renderType:"Circle",
		width:width,
		height: 2, 
		rot: dir,
		color : {
			r: 255,
			g: 0,
			b: 0,
		},
		update: function(delta){
			if (Date.now() > _removeTime){
				ents.splice(ents.indexOf(this), 1);
			}
		},
		//End Public Variables and functions
	};

	//Initialize Object
	//End Initialize Object

	return obj;
}*/


function CreateBloodSplatter(x,y, dir, width){
	var obj =  {
		//Public Variables and functions
		loc: new Vec2(x, y),
		renderType:"Circle",
		width:width,
		height: 2, 
		rot: dir,
		color : {
			r: 255,
			g: 0,
			b: 0,
		}
		//End Public Variables and functions
	};
	
	RenderObject(obj, bloodCtx);
}



function CreateDeadHuman(x,y){
	//Private variables
	var _timeUntilRevive = 10000;
	var _revTime = Date.now() + _timeUntilRevive;

	var _chanceToRev = .5;
	//End Private Variables

	var obj =  {
		//Public Variables and functions
		loc: new Vec2(x, y),
		renderType:"Circle",
		width:12,
		color : {
			r: 255,
			g: 0,
			b: 0,
		},
		update: function(delta){
			if (Date.now() > _revTime){
				if (Math.random() < _chanceToRev){
					ents.push(CreateZombie(this.loc.getX(), this.loc.getY()));//CREATE ZOMBIE
				}
				else{
					
				}
				ents.splice(ents.indexOf(this), 1);
				RenderObject(this, bloodCtx);//Leave the blood splatter
			}
		},
		//End Public Variables and functions
	};

	//Initialize Object
	//End Initialize Object

	return obj;
}

function CreatePerson(x,y){
	//Private variables
	var _speed = 20 + RandomClamped( -10, 10) + ZOMB_SPEED_BONUS;
	var _dir = new Vec2(_speed,0);
	var _timeStart = 0;
	var _timeEnd = 0;
	var _isHuman = true;
	var _randomWalk = true;
	var _detectRange = 100;
	var _health = 10;
	var _maxHealth = _health;

	var _attack = .5;
	var _attackRange = this.width/2;
	var _timeBetweenAttacks = 500;
	var _nextAttack = 0;//The system time (in milliseconds) when this unit can attack again

	//End Private Variables

	var obj =  {
		//Public Variables and functions
		loc: new Vec2(x, y),
		renderType:"Circle",
		width:10,
		color : {
			r: 0,
			g: 0,
			b: 0,
		},
		healthBar: {
			loc: new Vec2(x, y),
			renderType:"Rectangle",
			width:10,
			height:5,
			color : {
				r: 0,
				g: 255,
				b: 0,
			}			
		},
		isHuman: function(){
			return _isHuman;
		},
		setIsHuman: function(isH){
			_isHuman = isH;
		},
		setSpeed: function(spd){
			_speed = _speed + spd;
		},
		update: function(delta){
			this.loc.add(_dir.getX() * delta, _dir.getY() * delta);

			if (Date.now() > _timeEnd && _randomWalk){
				this.changeRandDir();
			}

			this.checkWallCollisions();
			this.checkPersonCollisions();

			if (this.hasOwnProperty('frameUpdate')){
				this.frameUpdate(delta);
			}
			//console.log("UPDATE: " + _dir.getX() + " " + _dir.getY() + " " + _dir.getMag());
		},
		checkWallCollisions: function(){
			if (this.loc.getX() + this.width> canvas.width){
				this.loc.setX( canvas.width - this.width);
			}

			if (this.loc.getX()  - this.width< 0){
				this.loc.setX( 0 + this.width);
			}

			if (this.loc.getY() + this.width > canvas.height){
				this.loc.setY( canvas.height - this.width);
			}

			if (this.loc.getY() - this.width < 0){
				this.loc.setY( 0 + this.width);
			}
		},
		checkPersonCollisions: function(){
			var enemyDetected = false;
			for (var i = 0; i < ents.length; i++){
				var ent = ents[i];
				if (ent.hasOwnProperty('loc') == true && ent.hasOwnProperty('isHuman') == true){//Is a valid entity
					if (ent.loc !== this.loc){
						if (isCollisionCircle(ent, this)){
							if (this.isHuman() !== ent.isHuman()){
								if (this.isHuman()){
									ent.attemptDamage(this);
									//ents.push(CreateZombie(this.loc.getX(), this.loc.getY()));
									//ents.splice(ents.indexOf(this), 1);
								}else{
									this.attemptDamage(ent);
									//ents.push(CreateZombie(ent.loc.getX(), ent.loc.getY()));
									//ents.splice(i, 1);
								}
							}
						}
						else if (Dist(this.loc.getX(), this.loc.getY(), ent.loc.getX(), ent.loc.getY()) < _detectRange){
							if (this.isHuman() !== ent.isHuman()){
								if (this.hasOwnProperty('detectEnemy'))
									this.detectEnemy(ent);
								enemyDetected = true;
							}
						}
					}
				}
			}

			if (enemyDetected === false){
				if (this.hasOwnProperty('noEnemyDetected'))
					this.noEnemyDetected();
			}
		},
		changeDir: function(dir){
			_dir.setMag(_speed);
			_dir.setAngle(dir);
		},
		changeRandDir: function(){
			if (Math.random() < .25){
				_dir.setMag(0);
			}
			else{
				_dir.setMag(_speed);
				_dir.setAngle(RandomClamped(0, Math.PI * 2));
			}
			//console.log(_dir.getX() + " " + _dir.getY() + " " + _dir.getMag());
			_timeStart = Date.now();
			_timeEnd = _timeStart + RandomClampedInt(500, 3000);
		},
		startWandering: function(){
			if (_randomWalk == false){
				this.changeRandDir();
				_randomWalk = true;
			}
		},
		stopWandering: function(){
			_randomWalk = false;
		},
		draw: function(){
			RenderObject(this);

			this.healthBar.loc = new Vec2(this.loc.getX(), this.loc.getY() - this.width/2 - 3);
			this.healthBar.width = _health * 2;
			RenderObject(this.healthBar);
		},
		attemptDamage: function(who){
			if (Date.now() > _nextAttack){
				who.damage(_attack);
				if (!this.isHuman()){
					_health = _health + 1;
					_health  = _health.clamp(0, _maxHealth);
				}
				_nextAttack = Date.now() + _timeBetweenAttacks;
			}
		},
		damage: function(howMuch){
			_health = _health - howMuch;
			CreateBloodSplatter(this.loc.getX() + RandomClamped(-5,5), this.loc.getY() + RandomClamped(-5,5), _dir.getAngle() + RandomClamped(-Math.PI/2, Math.PI/2), 5);//Create a blood splatter
			CreateBloodSplatter(this.loc.getX() + RandomClamped(-5,5), this.loc.getY() + RandomClamped(-5,5), _dir.getAngle() + RandomClamped(-Math.PI/2, Math.PI/2), 3);//Create a blood splatter
			
			if (_health < 0){
				if (this.isHuman()){
					ents.unshift(CreateDeadHuman(this.loc.getX(), this.loc.getY()));
				}
				ents.splice(ents.indexOf(this), 1)
			}
		}
		//End Public Variables and functions
	};

	//Initialize Object
	obj.startWandering();
	//End Initialize Object


	return obj;
}


function CreateZombie(x,y){
	var obj = {};
	obj = CreatePerson(x,y);
	obj.color = ZOMBIECOLOR;
	obj.setIsHuman(false);

	var _nextDecay = 0;
	var _timeBetweenDecays = 10000;//10 seconds

	obj.detectEnemy = function(ent){
		this.stopWandering();
		this.changeDir(Math.atan2(ent.loc.getY() - this.loc.getY(), ent.loc.getX() - this.loc.getX()));
	};

	obj.noEnemyDetected = function(){
		this.startWandering();
	};

	obj.frameUpdate = function(){
		if (Date.now() > _nextDecay){
			this.damage(1);
			_nextDecay = Date.now() + _timeBetweenDecays;
		}
	};

	return obj;

}

function CreateHuman(x,y){
	var obj = {};
	obj = CreatePerson(x,y);
	obj.setIsHuman(true);

	obj.color = {
			r: 217,
			g: 108,
			b: 0,
	};


	obj.detectEnemy = function(ent){
		this.stopWandering();
		this.changeDir(Math.atan2(-(ent.loc.getY() - this.loc.getY()), -(ent.loc.getX() - this.loc.getX())));
	};

	obj.noEnemyDetected = function(){
		this.startWandering();
	};

	obj.frameUpdate = function(){

	};

	return obj;

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


function isCollisionRect(rect1, rect2){
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

function isCollisionCircle(circ1, circ2){
	if (Dist(circ1.loc.getX(), circ1.loc.getY(), circ2.loc.getX(), circ2.loc.getY()) < circ1.width/2 + circ2.width/2)
		return true;
	else
		return false;
}
// Handle keyboard controls
var keysDown = {};


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

	}
}, false);

addEventListener("mouseup", function (e) {
    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3; 
    else if ("button" in e)  // IE, Opera 
        isRightMB = e.button == 2; 
        	
}, false);

addEventListener("mousemove", function (e) {

}, false);



// Update game objects
var update = function (modifier) {	
	for (var i = 0; i < ents.length; i++){
		var ent = ents[i];

		if (ent.update){
			ent.update(modifier);
		}
	}
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


// Draw everything
var render = function () {
	ctx.clearRect(0,0, canvas.width, canvas.height);

	for (var i = 0; i < ents.length; i++){
		var rend = ents[i];
		
		if (rend.hasOwnProperty('draw')){
			rend.draw();
		}else{
			RenderObject(rend);
		}
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

						
var init = function(){
	resize();
    window.onresize = resize;

   for (var i = 0; i < 300; i ++){
   		ents.push(CreateHuman(RandomClampedInt(0, canvas.width),RandomClampedInt(0, canvas.height)));
   }
   for (var i = 0; i < 10; i ++){
   		ents.push(CreateZombie(RandomClampedInt(0, canvas.width),RandomClampedInt(0, canvas.height)));
   }
   

   Buttons.addButton({
   		ID: "TEST",
   		x: 100,
   		y: 100, 
   		color: {r: 255, g:0, b: 0},
   		renderType: "Image",
   		image: "images/speed_upgrade.png",
   		callback: function(){
   			applyUpgrade(false, 'setSpeed', 10);
   			ZOMB_SPEED_BONUS+=10;
   		},
   });

   Buttons.addButton({
   		ID: "TEST1",
   		x: 300,
   		y: 300, 
   		width: 175,
   		height: 75,
   		color: {r: 255, g:0, b: 0},
   		renderType: "Rectangle",
   		text: {
	   		x: 215,
	   		y: 300, 
	   		color: {r: 0, g:0, b: 0},
	   		renderType: "Text",
	   		font: '15px Arial Bold',
	   		text: "Upgrade Zombie Speed"
   		},
   		callback: function(){
   			alert("CLICKED 1");
   		},
   });

	then = Date.now();

	main();
}



function resize()
{
	var w = window.innerWidth;
	var h = window.innerHeight;

	ctx.canvas.width  = window.innerWidth; 
	ctx.canvas.height = window.innerHeight; 

	//Redraw blood canvas while preserving contents
	// create a temporary canvas obj to cache the pixel data //
    var temp_cnvs = document.createElement('canvas');
    var temp_cntx = temp_cnvs.getContext('2d');
	// set it to the new width & height and draw the current canvas data into it // 
    temp_cnvs.width = w; 
    temp_cnvs.height = h;
    temp_cntx.drawImage(bloodCanvas, 0, 0);
	// resize & clear the original canvas and copy back in the cached pixel data //
    bloodCanvas.width = w; 
    bloodCanvas.height = h;
    bloodCtx.drawImage(temp_cnvs, 0, 0);

	//bloodCanvas.width = window.innerWidth;
	//bloodCanvas.height = window.innerHeight;	
}




var then = Date.now();
AM.downloadAll(init);
