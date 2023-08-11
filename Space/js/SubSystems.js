function SubSystemRender(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Renderer");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"Renderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if (!pos.width){
					var nImg = AM.getAsset(rend.image);
					pos.width = nImg.width * rend.sizeX;
					pos.height = nImg.height * rend.sizeY;
				}

				this.ctx.save(); 
					this.ctx.translate(pos.x, pos.y);
					this.ctx.rotate(pos.rot);
					var asset = AM.getAsset(rend.image);
					if (rend.image != ROCKET){
						this.ctx.drawImage(asset, -asset.width/2, -asset.height/2);
					}
					else{
						if (this.EM.getComponent(ent, "ArtificialInput")){
							//if (ctx.fillStyle != "#aa0000")
								ctx.fillStyle = "rgb("+1+this.EM.getComponent(ent,"ShipController").team*30+","+1+this.EM.getComponent(ent,"ShipController").team*30 + ","+1+this.EM.getComponent(ent,"ShipController").team*30+";"
						}
						else{
							ctx.fillStyle =  playerStyle;
						}
						ctx.beginPath();  
						ctx.moveTo(25,0);  
						ctx.lineTo(-10,-10);  
						ctx.lineTo(-10,10);  
						ctx.fill();  
					}
				this.ctx.restore();
			}
		}
	}
}


function SubSystemSpatial(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Spatial");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var pos = this.EM.getComponent(ents[i], "Spatial");
				if (pos.rot > Math.PI * 2 || pos.rot < Math.PI * -2){
					pos.rot = pos.rot % (Math.PI * 2);	
				}
			}
		}
	}
}


function SubSystemRectRender(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;

	this.update = function(delta){
		var lastStyle = this.ctx.fillStyle;

		var ents = this.EM.getAllEntitiesWith("RectRenderer");
		if (ents){
			for (var i = 0; i< ents.length; i++){							
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"RectRenderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				var style = rend.color;
				
				if (!pos.width){
					pos.width = rend.width;
					pos.height = rend.height;
				}
				
				if (style != lastStyle){
					this.ctx.fillStyle = style;
					lastStyle = style;
				}

				var rot = pos.rot;
				//this.ctx.save(); 
					this.ctx.translate(pos.x, pos.y);
					if (!(rot < .1 && rot > -.1))
						this.ctx.rotate(rot);			
					this.ctx.fillRect(-rend.width/2,-rend.height/2, rend.width, rend.height);
					if (!(rot < .1 && rot > -.1))
						this.ctx.rotate(-rot);								
					this.ctx.translate(-pos.x, -pos.y);
				//this.ctx.restore();
			}
		}
		this.ctx.fillStyle = "rgb(255,255,255)";
	}
}



function SubSystemMovement(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Movement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if (move.apply){
					pos.x = pos.x + move.vec.getX() * delta;
					pos.y = pos.y + move.vec.getY() * delta;
				}
			}
		}
	}	
}


function SubSystemStarWrap(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("StarWrap");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				
				pos.x += canvas.width;
				pos.y += canvas.height;

				pos.x = pos.x % canvas.width;
				pos.y = pos.y % canvas.height;
				
				//move = this.EM.getComponent(ent,"Movement").vec;	
				//star = this.EM.getComponent(ent,"StarWrap");
				//move.setX(move.getX() / star.d);	
				//move.setY(move.getY() / star.d);
			}
		}
	}	
}

function SubSystemDeletetions(EntityMan, ctext){
	this.EM = EntityMan;
	this.ctx = ctext;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("DeleteWhenOffScreen");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var dist = this.EM.getComponent(ent,"DeleteWhenOffScreen").dist;
				var w = this.ctx.canvas.width;
				var h = this.ctx.canvas.height;
				
				if (pos.x > w + dist || pos.x < 0 - dist || pos.y > h + dist || pos.y < 0 - dist){
					this.EM.removeEntity(ent);	
				}
			}
		}
	}	
}



function SubSystemParticles(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ParticleController");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement").vec;
				var rend = this.EM.getComponent(ent,"RectRenderer");
				var partC = this.EM.getComponent(ent,"ParticleController");
				var initSpeed = partC.initSpeed;
				
				
				var acc = 200;
				move.addToMag(-acc*delta);
				
				if (move.getMag() < initSpeed /2 && !partC.shrunk){
					rend.width = rend.width / 2;
					rend.height = rend.height / 2;
					partC.shrunk = true;	
				}
				if (move.getMag() < acc*.1){
					this.EM.removeEntity(ent);	
				}
			}
		}
	}	
}




function SubSystemShipController(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ShipController");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				var inputs = this.EM.getComponentStartsWith(ent, "Input");
				var ship = this.EM.getComponent(ent, "ShipController");
				var rend = this.EM.getComponentStartsWith(ent, "Renderer");
	
				if (inputs.left){
					pos.rot -= ship.dRot * delta;
					ship.dirFacing -= ship.dRot * delta;
					//this.updateCtx();
				}
				else if (inputs.right){
					pos.rot += ship.dRot * delta;
					ship.dirFacing += ship.dRot * delta;
					//this.updateCtx();		
				}
				
				if (inputs.up){
					if (move.vec.getMag() < ship.maxSpeed){
						var dirx = Math.cos(ship.dirFacing)  * ship.acc;
						var diry = Math.sin(ship.dirFacing)  * ship.acc;
						move.vec.add(dirx, diry);
					}
					/*for (var j = 0; j < 10; j++){
						CreateParticle({r: 255, g:  Math.floor(Math.random() * 150), b: Math.floor(Math.random() * 10)},
													 ship.dirFacing - Math.PI - Math.PI / 4 + ((Math.PI / 2) * Math.random()), 
													 100 + ship.maxSpeed/10*Math.random(),
													 pos.x  + Math.cos(ship.dirFacing - Math.PI) * 18 , 
													 pos.y + Math.sin(ship.dirFacing - Math.PI) * 18  , 
													 3); 
					}*/
				}
				else if (!inputs.up){	
				}
			
				if (move.vec.getMag() > ship.airRes){ 
					move.vec.addToMag(-ship.airRes);
				}
				else {
					if (move.vec.getMag() != 0)
						move.vec.setMag(0);	
				}
				
				
				/*if (inputs.shoot && ship.timeSinceLastShot > ship.timeBetweenShots){
					var dist = 60;
					CreateBasicBullet(ent, pos.x + Math.cos(ship.dirFacing) * dist, pos.y + Math.sin(ship.dirFacing) * dist, rend.rot);
					ship.timeSinceLastShot = 0;
				}
				
				ship.timeSinceLastShot += delta;*/
			
			}
		}
	}	
}

function SubSystemGuns(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Gun");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var inputs = this.EM.getComponentStartsWith(ent, "Input");
				var gun = this.EM.getComponent(ent, "Gun");
				gun.timeSinceLastShot += delta;
				
				if (inputs.shoot && gun.timeSinceLastShot > gun.timeBetweenShots){
					var pos = this.EM.getComponent(ent,"Spatial");
					var rend = this.EM.getComponentStartsWith(ent, "Renderer");
					var move = this.EM.getComponent(ent, "Movement");
					
					var dist = gun.offSet;
					var func = "Create";
					func += gun.type;
					func += "Bullet";
					
					var fn = window[func];
					if(typeof fn === 'function') {
						fn(ent, pos.x, pos.y, dist, pos.rot, move.vec.getMag());
					}

					//CreateDoubleBullet(ent, pos.x, pos.y, dist, rend.rot);
					
					gun.timeSinceLastShot = 0;
				}
			}
		}
	}
}

function SubSystemArtificialInput(EntityMan){
	this.EM = EntityMan;
	this.stopDistance = 300;
	this.shootDistance = 400;
	this.shootRange = Math.PI / 8;
	this.visionDistance = 2000;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("ArtificialInput");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				
				var out = this.EM.getComponent(ent, "ArtificialInput");
				var myPos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponentStartsWith(ent, "Render");	
				var cont = this.EM.getComponent(ent, "ShipController");
						
				var others = this.EM.getAllEntitiesWith("ShipController");
				var bestDistance = [1000000000,""];
				
				for (var j = 0; j< others.length; j++){
					var currentEnt = others[j];
					if (currentEnt != ent && cont.team != this.EM.getComponent(currentEnt, "ShipController").team){
						var hisPos = 	this.EM.getComponent(currentEnt,"Spatial");
						
						var dist = (myPos.x - hisPos.x)*(myPos.x - hisPos.x) + (myPos.y - hisPos.y)*(myPos.y - hisPos.y);
						if (dist < bestDistance[0]){
							bestDistance = 	[dist,currentEnt];
							if (bestDistance[0] < this.stopDistance){
								break;
							}
						}
					}
				}
				
				var target = bestDistance[1];
				var distance = Math.sqrt(bestDistance[0]);
				
				if (distance < this.visionDistance){
					out.up = true;
					if (distance < this.stopDistance){
						out.up = false;	
					}
					
					var hisPos = this.EM.getComponent(target,"Spatial");
					var x1 = Math.cos(myPos.rot);
					var y1 = Math.sin(myPos.rot);
					
					var x2 = hisPos.x - myPos.x;
					var y2 = hisPos.y - myPos.y;
					var mag = Math.sqrt(x2*x2 + y2*y2);
					x2 = x2/mag;
					y2 = y2/mag;
					var angle1 = Math.atan2(y1,x1);
					var angle2 = Math.atan2(y2,x2);
					var angle = angle2 - angle1;
					
					if (Math.abs(angle) < this.shootRange && distance < this.shootDistance){
						out.shoot = true;
					}
					else{
						out.shoot = false;
					}
					
					if (Math.abs(angle) > 5 / 180 * Math.PI){
						if (angle > 0){
							out.right = true;
						}
						else if (angle < 0){
							out.left = true;
						}
					}	
					else{
						out.left = false;
						out.right  = false;	
					}
				}
			}
		}
	}
		
};

function SubSystemHumanInput(EntityMan){
	this.EM = EntityMan;

	this.up = 38;
	this.left = 37;
	this.right = 39;
	this.shoot = 32;
	
	this.keyMap = {
		"38" : "up",
		"37" : "left",
		"39" : "right",
		"32" : "shoot"
	};
	
	
	this.keyDown = function(key){
		if ( this.keyMap[key.toString()] ){
			var dwn = this.keyMap[key.toString()];
			
			var ents = this.EM.getAllEntitiesWith("Input-Human");
			
			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				input[dwn] = true;
			}
		}
	};
	
	this.keyUp = function(key){
		if ( this.keyMap[key.toString()] ){
			var up = this.keyMap[key.toString()];
			
			var ents = this.EM.getAllEntitiesWith("Input-Human");

			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				input[up] = false;
			}
		}
	};	
		
};

function SubSystemAffectedByPlayer(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var hPlayer = getCurrentPlayerName();
		if (hPlayer) {
			var move = this.EM.getComponent(hPlayer, "Movement").vec;
		}
		else{
			var move = new Vec2();
		}

		var ents = this.EM.getAllEntitiesWith("AffectedByPlayerMovement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				//move1 = this.EM.getComponent(ent,"Movement").vec;

				//move1.setX(-move.getX());
				//move1.setY(-move.getY());	
				aff = this.EM.getComponent(ent,"AffectedByPlayerMovement");
				
				pos.y += (-move.getY() * delta) / aff.d;
				pos.x += (-move.getX() * delta) / aff.d;
			}
		}
	};
};


function SubSystemCollisions(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Collider");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponentStartsWith(ent, "Renderer");
				
				var w = pos.width;
				var h = pos.height;
				var x = pos.x;
				var y = pos.y;
				
				for (var j = 0; j< ents.length; j++){
					var nEnt = ents[j];	
					var nPos = this.EM.getComponent(nEnt,"Spatial");
					var nRend = this.EM.getComponentStartsWith(nEnt, "Renderer");
					var nw = pos.width;
					var nh = pos.height;
					var nx = nPos.x;
					var ny = nPos.y;
					
					if (x + w / 2 > nx - nw / 2 && x - w / 2 < nx + nw/2 && y + h / 2 > ny - nh / 2 && y - h / 2 < ny + nh/2 && !(ent == nEnt)){//quick and dirty
						var nCollide = this.EM.getComponent(nEnt, "Collider").type;
						var Collide = this.EM.getComponent(ent, "Collider").type;
						
						var remove1 = false;
						var remove2 = false;
						if ( this.EM.getComponent(nEnt, "Damager"))	{
								if( this.EM.getComponent(nEnt, "Damager").exception == ent)
									continue;
						}

						if (  this.EM.getComponent(ent, "Damager") ) {
								if (  this.EM.getComponent(ent, "Damager").exception == nEnt ) 
									continue;
						}

						if (this.shouldCollide(nCollide, Collide)){
							if (this.EM.getComponent(ent, "Health")){
								if ( this.EM.getComponent(nEnt, "Damager"))	{
									if( this.EM.getComponent(nEnt, "Damager").exception != ent){
										var h = this.EM.getComponent(ent, "Health");
										if (h.health <= 1){
											remove1 = true;
										}
										else{
											h.health -= 1; 	
										}
									}
								}
							
								if (this.EM.getComponent(nEnt, "PowerUpHolder") && this.EM.getComponent(ent, "PowerUpManager")){
									this.EM.getComponent(ent, "PowerUpManager").addPowerUp(ent, this.EM.getComponent(nEnt, "PowerUpHolder").pwUp);
								}
							}
							else{
								remove1 = true;
							}
							
							
							if (this.EM.getComponent(nEnt, "Health")){
								if (  this.EM.getComponent(ent, "Damager") ) {
									if (  this.EM.getComponent(ent, "Damager").exception != nEnt ) {
										var h = this.EM.getComponent(nEnt, "Health");
										if (h.health <= 1){
											remove2 = true;
										}
										else{
											h.health -= 1; 	
										}
									}
								}
								
								if (this.EM.getComponent(ent, "PowerUpHolder") && this.EM.getComponent(nEnt, "PowerUpManager")){
									this.EM.getComponent(nEnt, "PowerUpManager").addPowerUp( nEnt, this.EM.getComponent(ent, "PowerUpHolder").pwUp);
								}								
							}
							else{
								remove2 = true;
							}
						
							var hPlayer = this.EM.getAllEntitiesWith("Input-Human");
							if (hPlayer) {
								hPlayer = hPlayer[0];
							}

							if ((ent == hPlayer && remove1) ||( nEnt==hPlayer && remove2)){
								var time = Date.now() - backThen;
								var stringy = "GAME OVER! \nYou lasted " + time/1000 + " seconds and killed " + killCount + " enemies.";
								if (cheated){
									stringy += "\nBut, you cheated."	
								}
								alert(stringy);	
								window.location.reload(true);
							}
							
							if ((this.EM.getComponent(ent, "ArtificialInput")  && remove1)||(this.EM.getComponent(nEnt, "ArtificialInput") && remove2)){
								killCount ++;
								currentEnemyCount--;
								if (remove1){
									if (this.EM.hasComponent(ent, "PowerUpManager")){
										this.dropPowerUps(x,y, this.EM.getComponent(ent, "PowerUpManager") );	
									}
								}
								else if (remove2){
									if (this.EM.hasComponent(nEnt, "PowerUpManager")){
										this.dropPowerUps(nx, ny, this.EM.getComponent(nEnt, "PowerUpManager") );	
									}
								}
							}
						
							if (remove1){
								this.EM.removeEntity(ent);	
								i = 100000; //Hackey...we need a way to exit the main loop if ent is destroye
								j = 100000;
							}
							
							if (remove2){
								this.EM.removeEntity(nEnt);	
								break;
							}
						} 
					}
				}
			}
		}
	};
	
	this.dropPowerUps = function(x,y, manager){
		for (var i = 0; i < manager.currentPowerUps.length; i++){
			CreatePowerUp(x + Math.random() * 100 - 50, y + Math.random() * 100 - 50, manager.currentPowerUps[i]	);
		}
	}
	
	
	this.shouldCollide = function(a, b){
		if (a==b){
			return false;	
		}
		
		switch (a){
			case fleshlingCollision:
				switch (b){
					case bulletCollision:
						return true;
						break;
					case powerUpCollision:
						return true;
						break;
				}
				break;	
			case bulletCollision:
				switch (b){
					case fleshlingCollision:
						return true;
						break;	
					case powerUpCollision:
						return false;
						break;
				}
				break;
			case powerUpCollision:
				switch (b){
					case fleshlingCollision:
						return true;
						break;	
					case bulletCollision:
						return false;
						break;
				}
				break;
		}
		
	}
};
