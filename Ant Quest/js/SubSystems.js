/////////////////////////////////////////////////////////////////////////////////
// TO DO (SubSystems.js):
// - Render Subsystem needs to be more versitile and lightweight
// - 
/////////////////////////////////////////////////////////////////////////////////


function SubSystemRender(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;
	
	this.update = function(delta){
		var lastStyle = this.ctx.fillStyle;
		
		var playerPos = this.EM.getComponent(getCurrentPlayerName(), "Spatial");
		
		this.ctx.save();
		this.ctx.translate(-playerPos.x + this.ctx.canvas.width/2, -playerPos.y + this.ctx.canvas.height/2);
		var ents = this.EM.getAllEntitiesWith("Renderer");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"Renderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				/*if (!pos.width){
					var nImg = AM.getAsset(rend.image);
					pos.width = nImg.width * rend.sizeX;
					pos.height = nImg.height * rend.sizeY;
				}*/
				
				this.ctx.save(); 
					this.ctx.translate(pos.x, pos.y);
					this.ctx.rotate(pos.rot);
									
					//var asset = AM.getAsset(rend.image);
					//if (rend.image != ROCKET){
					//	this.ctx.drawImage(asset, -asset.width/2, -asset.height/2);
					//}
					//else{
					
					switch (rend.type){
						case "Triangle":
							//if (rend.color != lastStyle){
								//console.log("Changing");
								this.ctx.fillStyle = rend.color;
								//lastStyle = rend.color;
							//}	
							//else{ console.log("Not Changing"); }
							ctx.beginPath();  
							ctx.moveTo(rend.height,0);  
							ctx.lineTo(-rend.width,-rend.width);  
							ctx.lineTo(-rend.width,rend.width);  
							ctx.fill();							
							break;
						case "Rectangle":
							//if (rend.color != lastStyle){
								this.ctx.fillStyle = rend.color;
							//	lastStyle = rend.color;
							//}	
							this.ctx.fillRect(-rend.width/2,-rend.height/2, rend.width, rend.height);
							break;
						case "Image":
							if (rend.image.constructor == String){
								var ourImage = AM.getAsset(rend.image);
								this.ctx.drawImage(ourImage, -ourImage.width/2,-ourImage.height/2);
								
								if (!rend.width){
									rend.width = ourImage.width;
									rend.height = ourImage.height;
								}							
							}
							else {
								this.ctx.drawImage(rend.image, -rend.image.width/2,-rend.image.height/2);
								
								if (!rend.width){
									rend.width = rend.image.width;
									rend.height = rend.image.height;
								}
							}
						}
				this.ctx.restore();
			}	
		}
		this.ctx.restore();
	}	
}


function SubSystemSpatial(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){ //Function to make sure all rotations are between 0 and 2PI. Useful, but not necessary.
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
					if (move.vec.getMag() <= ship.maxSpeed){
						//var dirx = Math.cos(pos.rot)  * ship.acc;
						//var diry = Math.sin(pos.rot)  * ship.acc;
						//move.vec.add(dirx, diry);
						//move.vec = new Vec2(dirx, diry);
						move.vec.setAngle(pos.rot);
						
						if (move.vec.getMag() < .01){
							move.vec.setMagFromZero(move.vec.getMag() + ship.acc, pos.rot);
						}
						else{
							move.vec.addToMag(ship.acc);
						}
					}
				}
				else if (!inputs.up){
					//move.vec = new Vec2(0,0);
				}
			
				if (move.vec.getMag() > ship.airRes){ 
					move.vec.addToMag(-ship.airRes);
				}
				else {
					if (move.vec.getMag() != 0)
						move.vec.setMag(0);	
				}
				
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

					var fn = Factory[func];
					if(typeof fn === 'function') {
						fn(ent, pos.x, pos.y, dist, pos.rot, move.vec.getMag());
					}
					
					//console.log(fn);
					//Factory.CreateDoubleBullet(ent, pos.x, pos.y, dist, rend.rot);
					
					gun.timeSinceLastShot = 0;
				}
			}
		}
	}
}

function SubSystemArtificialInput(EntityMan){
	this.EM = EntityMan;
	this.shootRange = Math.PI / 8;
	this.visionDistance = 1000;
	//this.stopDistance = 50;
	//this.shootDistance = 50;	
	
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
				
				var teamToTarget = -100;
				if (out.follow){
					teamToTarget = cont.team;
				}
				
				for (var j = 0; j< others.length; j++){
					var currentEnt = others[j];
					var otherTeam = this.EM.getComponent(currentEnt, "ShipController").team;
					if (currentEnt != ent && (cont.team != otherTeam || otherTeam == teamToTarget )){
						var hisPos = 	this.EM.getComponent(currentEnt,"Spatial");
						
						var dist = (myPos.x - hisPos.x)*(myPos.x - hisPos.x) + (myPos.y - hisPos.y)*(myPos.y - hisPos.y);
						if (dist < bestDistance[0]){
							bestDistance = 	[dist,currentEnt];
							if (bestDistance[0] < out.stopDistance){
								break;
							}
						}
					}
				}
				
				var target = bestDistance[1];
				var distance = Math.sqrt(bestDistance[0]);
				
				if (distance < this.visionDistance){
					out.up = true;
					if (distance < out.stopDistance){
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
					
					if (Math.abs(angle) < this.shootRange && distance < out.shootDistance){
						if (!out.follow){
							out.shoot = true;
						}
						else{
							if (this.EM.getComponent(target,"ShipController").team == cont.team){
								out.shoot = false;
							}
							else{
								out.shoot = true;
							}
						}
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
				if (input[dwn] == false){
					//console.log("DOwn -here");
					input[dwn] = true;
				}
			}
		}
	};
	
	this.keyUp = function(key){
		if ( this.keyMap[key.toString()] ){
			var up = this.keyMap[key.toString()];

			var ents = this.EM.getAllEntitiesWith("Input-Human");

			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				
				//if (input[up] == true){
					input[up] = false;
				//}
			}

		}
	};	
		
};

function SubSystemAffectedByPlayer(EntityMan){
	this.EM = EntityMan;
	this.lastPlayerPosX = 'undefined';
	this.lastPlayerPosY = 'undefined';
	
	this.update = function(delta){
		var hPlayer = getCurrentPlayerName();
		if (hPlayer) {
			var pos = this.EM.getComponent(hPlayer, "Spatial");
			var posX = pos.x;
			var posY = pos.y;
		}
		else{
			var posX = 'undefined';
			var posY = 'undefined';
		}

		var ents = this.EM.getAllEntitiesWith("AffectedByPlayerMovement");
		if (ents){
			if (this.lastPlayerPosX == 'undefined' || this.lastPlayerPosY == 'undefined'){
				this.lastPlayerPosX = posX;
				this.lastPlayerPosY = posY;
				return;
			}
				
			if ( posX == 'undefined' || posY == 'undefined'){
				return;
			}
				
			var moveX = this.lastPlayerPosX - posX;
			var moveY = this.lastPlayerPosY - posY;
			
			this.lastPlayerPosX = posX;
			this.lastPlayerPosY = posY;
			
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");

				aff = this.EM.getComponent(ent,"AffectedByPlayerMovement");
				
				pos.y += moveY / aff.d;
				pos.x += moveX / aff.d;
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
				
				if (this.EM.getComponent(ent, "Collider").type == wallCollision){
					continue;
				}
				
				
				var pos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponent(ent, "Renderer");
				var move = this.EM.getComponent(ent, "Movement");
				
				if (pos.width == 0 || pos.width == 'undefined'){//If our spatial component is invalid, just grab the render width and height
					//console.log(this.EM.getComponent(ent, "Collider").type)
					pos.width  = rend.width;
					pos.height = rend.height;
				}
				var w = pos.width;
				var h = pos.height;				
				var x = pos.x + move.vec.getX() * delta;
				var y = pos.y + move.vec.getY() * delta;
			
				
				for (var j = 0; j< ents.length; j++){
					var nEnt = ents[j];	
					var nPos = this.EM.getComponent(nEnt,"Spatial");
					var nRend = this.EM.getComponent(nEnt, "Renderer");
					var nMove = this.EM.getComponent(nEnt, "Movement");
					
					
					if (nPos.width == 0 || nPos.width == 'undefined'){//If our spatial component is invalid, just grab the render width and height

						if (nRend){
							nPos.width = nRend.width;
							nPos.height = nRend.height;
						}
					}	
					var nw = nPos.width;
					var nh = nPos.height;					
					var nx = nPos.x;
					var ny = nPos.y;
					
					//console.log(x + " " + y + " " + nx + " " + ny);
					//console.log(ent + "  " + nEnt);
					//console.log(x + " " + y + " " + nx + " " + ny + " " + w + " " + h + " " + nw + " " + nh);
					if (x + w / 2 > nx - nw / 2 && x - w / 2 < nx + nw/2 && y + h / 2 > ny - nh / 2 && y - h / 2 < ny + nh/2 && !(ent == nEnt)){//quick and dirty
						var nColl = this.EM.getComponent(nEnt, "Collider");
						var coll = this.EM.getComponent(ent, "Collider");
						var nCollide = nColl.type;
						var Collide = coll.type;
						
						var remove1 = false;
						var remove2 = false;
						
							switch (Collide){
								case fleshlingCollision://I am a bug
									switch (nCollide){
										case fleshlingCollision:
										
											var x1 = Math.cos(move.vec.getAngle());
											var y1 = Math.sin(move.vec.getAngle());
											
											var x2 = nPos.x - pos.x;
											var y2 = nPos.y - pos.y;
											var mag = Math.sqrt(x2*x2 + y2*y2);
											x2 = x2/mag;
											y2 = y2/mag;
											var angle1 = Math.atan2(y1,x1);
											var angle2 = Math.atan2(y2,x2);
											var angle = angle2 - angle1;
											
											var boostX;
											var boostY;
											var speedy = 2;
											var nTeam = this.EM.getComponent(nEnt, "ShipController").team;
											var team = this.EM.getComponent(ent, "ShipController").team;
											
											if (move.vec.getMag() == nMove.vec.getMag() && this.EM.hasComponent(ent, "Puncher")){
												if (((Date.now() - coll.lastCollision) > MAX_TIME_BETWEEN_COLLISIONS) && (Date.now() - nColl.lastCollision) > MAX_TIME_BETWEEN_COLLISIONS){
													if (this.EM.hasComponent(nEnt, "Health") && nTeam == GOOD_TEAM && team != GOOD_TEAM){
														this.EM.getComponent(ent, "Collider").lastCollision = Date.now();
														this.EM.getComponent(nEnt, "Collider").lastCollision = Date.now();
														hp = this.EM.getComponent(nEnt, "Health").health
														this.EM.getComponent(nEnt, "Health").health -= 1;
														if (hp < 1){
															
															remove2 = true;
														}
													}
												}
											}
											
											
											
											if (move.vec.getMag() > nMove.vec.getMag() && (team != nTeam) && (Math.abs(angle) < Math.PI/2) && this.EM.hasComponent(ent, "Puncher")
												&& ((Date.now() - coll.lastCollision) > MAX_TIME_BETWEEN_COLLISIONS) && (Date.now() - nColl.lastCollision) > MAX_TIME_BETWEEN_COLLISIONS){
												this.EM.getComponent(ent, "Collider").lastCollision = Date.now();
												this.EM.getComponent(nEnt, "Collider").lastCollision = Date.now();
												boostX = move.vec.getX() * speedy;
												boostY = move.vec.getY() * speedy;
												nMove.vec = new Vec2(boostX,boostY);
												
												if (this.EM.hasComponent(nEnt, "Health")){
													hp = this.EM.getComponent(nEnt, "Health").health
													this.EM.getComponent(nEnt, "Health").health -= 1;
													if (hp < 1){
														
														remove2 = true;
														Factory.CreateDeadBeetle(nx,ny,nPos.rot);
													}
												}
											}
											break;
										case bulletCollision://I ran into a bullet
											if (this.EM.hasComponent(ent, "Health")){
												hp = this.EM.getComponent(ent, "Health").health
												//console.log("here " + hp);
												this.EM.getComponent(ent, "Health").health -= 1;
												if (hp < 1){
													remove1 = true;
													Factory.CreateDeadBeetle(nx,ny,pos.rot);
												}
											}
											remove2 = true;
											break;
										case wallCollision://We are hitting a wall
											var w2 = w / 2;
											var h2 = h / 2;
											var nw2 = nw / 2;
											var nh2 = nh / 2;

											var newx = pos.x - move.vec.getX()*delta;
											var newy = pos.y - move.vec.getY()*delta;											
											//if (!this.isCollision(x - move.vec.getX()*delta,y - move.vec.getY()*delta,w,h,nx,ny,nw,nh)){

												var vector = new Vec2(move.vec.getX()*delta, move.vec.getY()*delta);
												vector.setMag(1);
												
												if (newx - w2 > nx + nw2 || newx + w2 < nx - nw2){//offending is x
													//var divider = move.vec.getX() * delta /  vector.getX();
													//var newyness = vector.getY() * divider;
													//pos.y = newy + newyness;
													var hitX;
													if (newx - w2 > nx + nw2){//we're on right
														hitX = nx + nw2 + w2+1;
													}													
													else if (newx + w2 < nx - nw2){//on left
														hitX = nx - nw2 - w2-1;
													}
													var difference = hitX - newx - 1;
													var mult = vector.getX() / difference;
													var whereWeHitY = vector.getY() * mult;
													pos.x = hitX;
													pos.y = newy;
													//pos.y += whereWeHitY;
												}
												
												if (newy - h2 > ny + nh2 || newy + h2 < ny - nh2){//offending is y
													//var divider = move.vec.getY() * delta /  vector.getY();
													//var newyness = vector.getX() * divider;
													//pos.x += newyness; 
													var hitY;
													if (newy - h2 > ny + nh2){//we're on bottom
														hitY = ny + nh2 + h2 + 1;
													}													
													else if (newy + h2 < ny - nh2){//on top
														hitY = ny - nh2 - h2 - 1;
													}
													var difference = hitY - newy;
													var mult = vector.getY() / difference;
													var whereWeHitX = vector.getX() * mult;
													//pos.x += whereWeHitX;
													pos.x = newx;
													pos.y = hitY;
												}

											//}
											
											//pos.x = newx;
											//pos.y = newy;
											move.vec.setY(0);
											move.vec.setX(0);
											break;
									}
									break;	
								case bulletCollision://I am a bullet
									switch (nCollide){
										case fleshlingCollision://I hit a player
											//He can handle it!
											break;	
										case wallCollision://I hit a wall
											remove1 = true;//I AM DEAD. Delete me.
											break;
									}
									break;
							}
							
							if (remove1){
								if (this.EM.hasComponent(ent, "CouldBeControlled")){
									alert("YOU LOSE!");
									quit = true;
									window.location.reload(true);
								}
								else{
									currentEnemyCount--;
									this.EM.removeEntity(ent);	
								}
								break;
							}
							if (remove2){
								if (this.EM.hasComponent(nEnt, "CouldBeControlled")){
									alert("YOU LOSE!");
									quit = true;
									window.location.reload(true);
								}
								else{
									currentEnemyCount--;
									this.EM.removeEntity(nEnt);	
								}
								break;
							}
					}
				}
			}
		}
	};
	
	this.isCollision = function(x,y,w,h,nx,ny,nw,nh){
		return  (x + w / 2 > nx - nw / 2 && x - w / 2 < nx + nw/2 && y + h / 2 > ny - nh / 2 && y - h / 2 < ny + nh/2)
	};
	
};


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
				var player = this.EM.getComponent(getCurrentPlayerName(), "Spatial");

				
				if (pos.x > player.x + dist || pos.x < player.x - dist || pos.y > player.y + dist || pos.y < player.y - dist){
					this.EM.removeEntity(ent);	
					console.log("Delete");
				}
			}
		}
	}	
}


