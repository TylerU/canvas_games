/////////////////////////////////////////////////////////////////////////////////
// TO DO (SubSystems.js):
// - Render Subsystem needs to be more versitile and lightweight
// - 
/////////////////////////////////////////////////////////////////////////////////

var SubSystems = {};

SubSystems.SubSystemRender = function(EntityMan, context){
	this.EM = EntityMan;
	this.ctx = context;
	
	this.sort = function(ents){
		for(var i = 1; i < ents.length; i++){
			var thisOne = ents[i];
			var thisLayer = EntityMan.getComponent(thisOne, "Renderer").layer || 0;
			

			var j = i;
			while(j > 0){
				var him = ents[j-1];
				var hisLayer = EntityMan.getComponent(him, "Renderer").layer || 0;

				if(hisLayer > thisLayer){
					ents[j] = ents[j-1];
				}
				else{
					break;
				}
				j--;
			}
			ents[j] = thisOne;
		}

		return ents;
	},


	this.update = function(delta){
		var lastStyle = this.ctx.fillStyle;
		
		//var playerPos = this.EM.getComponent(getCurrentPlayerName(), "Spatial");
		
		//this.ctx.save();
		//this.ctx.translate(-playerPos.x + this.ctx.canvas.width/2, -playerPos.y + this.ctx.canvas.height/2);
		var ents = (this.EM.getAllEntitiesWith("Renderer").slice(0));
		this.sort(ents);


		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent,"Renderer");
				var pos = this.EM.getComponent(ent,"Spatial");
				

						
			    var currentCtx = (this.ctx !== undefined) ? this.ctx : ctx;

			    if ( (rend.visible == undefined) ? true : rend.visible){
			        currentCtx.save(); 
			            if (pos.x != undefined && pos.y != undefined)
			                currentCtx.translate(pos.x, pos.y);
			            else if (rend.loc != undefined)
			                currentCtx.translate(rend.loc.getX(), rend.loc.getY());
			            else
			                console.log("ERROR: No valid location to draw object");

			            currentCtx.rotate(rend.rot || 0);
			            currentCtx.scale( rend.flip ? -1 : 1,1);            
			            var h = ((rend.height) ? rend.height : rend.width)/2;
			            var w = rend.width/2;
			            
			            if (rend.color){
			                var color = "rgb(" + rend.color.r + "," + rend.color.g + "," + rend.color.b + ")";
			            }
			            else{
			                var color = "rgb(255,255,255)"//If no color is in the object, render it white   
			            }
			            
			            switch (rend.type){
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
			                    // currentCtx.drawImage(asset, -asset.width/2, -asset.height/2);//Draws at the image's size, not at the given size
			                    // currentCtx.drawImage(asset,0,0, asset.width, asset.height,x,y,width,height);
			                    currentCtx.drawImage(asset, 0, 0, asset.width, asset.height, -asset.width*(rend.scale || 1)/2, -asset.height*(rend.scale || 1)/2, asset.width*(rend.scale || 1), asset.height*(rend.scale || 1));//Draws at the image's size, not at the given size
			                    break;
			                case "Text":
			                    currentCtx.fillStyle = color;
			                    currentCtx.font = rend.font;
			                    currentCtx.fillText(rend.text, 0,0);
			                    //Draw Text
			                    break;
			                case "Sprite":
			                    var asset = AM.getAsset(rend.image);
			                    currentCtx.drawImage(asset, rend.curFrame.x, rend.curFrame.y, rend.spriteWidth, rend.spriteHeight, -rend.spriteWidth*(rend.scale || 1)/2, -rend.spriteHeight*(rend.scale || 1)/2, rend.spriteWidth*(rend.scale || 1), rend.spriteHeight*(rend.scale || 1));//Draws at the image's size, not at the given size
			                    break;ddd
			            }
			        currentCtx.restore();
			    }  
			} 
		}
	}
}



SubSystems.SubSystemShipController = function(EntityMan){
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
					move.vec.setX(-ship.maxSpeed);
				}
				else if (inputs.right){
					move.vec.setX(ship.maxSpeed);
				}
				else{
					move.vec.setX(0);
				}
				
				if (inputs.up){
					move.vec.setY(-ship.maxSpeed);
				}
				else if (inputs.down){
					move.vec.setY(ship.maxSpeed);
				}
				else{
					move.vec.setY(0);
				}				

				move.vec.setMag(ship.maxSpeed);
			}
		}
	}	
}



SubSystems.SubSystemSpatial = function(EntityMan){
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


SubSystems.SubSystemRectRender = function(EntityMan, context){
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
					if (!rend.width){
						rend.width = 20;
						rend.height = 20;
					}
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



SubSystems.SubSystemMovement = function(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Movement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var move = this.EM.getComponent(ent,"Movement");
				var pos = this.EM.getComponent(ent,"Spatial");
				
				if(move.dec > 0){
					move.vec.addToMag(-(move.dec*delta));

					if(move.vec.getMag() < 10){
						move.vec.setX(0);
						move.vec.setY(0);
						move.dec = -1;
					}
				}
				if (move.apply){
					pos.x = pos.x + move.vec.getX() * delta;
					pos.y = pos.y + move.vec.getY() * delta;
				}
			}
		}
	}	
}


// function SubSystemStarWrap(EntityMan){
// 	this.EM = EntityMan;

// 	this.update = function(delta){
// 		var ents = this.EM.getAllEntitiesWith("StarWrap");
// 		if (ents){
// 			for (var i = 0; i< ents.length; i++){
// 				var ent = ents[i];
// 				var pos = this.EM.getComponent(ent,"Spatial");
				
// 				pos.x += canvas.width;
// 				pos.y += canvas.height;

// 				pos.x = pos.x % canvas.width;
// 				pos.y = pos.y % canvas.height;
				
// 				//move = this.EM.getComponent(ent,"Movement").vec;	
// 				//star = this.EM.getComponent(ent,"StarWrap");
// 				//move.setX(move.getX() / star.d);	
// 				//move.setY(move.getY() / star.d);
// 			}
// 		}
// 	}	
// }


SubSystems.SubSystemDeletetions = function(EntityMan, ctext){
	this.EM = EntityMan;
	this.ctx = ctext;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("DeleteWhenOffScreen");

		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var dist = this.EM.getComponent(ent, "DeleteWhenOffScreen").dist;

				if (pos.x > this.ctx.width + dist || pos.x < 0 - dist || pos.y < 0 - dist || pos.y > this.ctx.height + dist){
					this.EM.removeEntity(ent);
				}
			}
		}
	}	
}



SubSystems.SubSystemDistanceDeletetions = function(EntityMan, ctext){
	this.EM = EntityMan;
	this.ctx = ctext;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("DeleteAfterTraveledDist");
		
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var deleteObj = this.EM.getComponent(ent,"DeleteAfterTraveledDist");
				
				if (deleteObj.startPos == null){
					deleteObj.startPos = {x:pos.x, y:pos.y};
				}

				if (Dist(deleteObj.startPos.x, deleteObj.startPos.y, pos.x, pos.y) > deleteObj.dist){
					this.EM.removeEntity(ent);
				}
			}
		}
	}	
}







SubSystems.SubSystemGuns = function(EntityMan){
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
						fn(ent, pos.x, pos.y, dist, inputs.angle + RandomClamped(-Math.PI/4 * (1.001-gun.accuracy), Math.PI/4 * (1.001-gun.accuracy)), move.vec.getMag(), gun.range, gun.damage);
					}
					
					//console.log(fn);
					//Factory.CreateDoubleBullet(ent, pos.x, pos.y, dist, rend.rot);
					
					gun.timeSinceLastShot = 0;
				}
			}
		}
	}
}


SubSystems.SubSystemAIMovement = function(EntityMan){
	this.EM = EntityMan;

	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("InputAndAIMovement");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				
				var out = this.EM.getComponent(ent, "InputAndAIMovement");
				var move = this.EM.getComponent(ent, "Movement");
				var myPos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponentStartsWith(ent, "Render");	

						
				out.timeSinceLastChange -= delta;//Update that thing

				var others = this.EM.getAllEntitiesWith("ShipController");
				var target = others[0];
				if(target){
					var hisPos = this.EM.getComponent(target,"Spatial");
					var angle = Math.atan2(hisPos.y - myPos.y, hisPos.x - myPos.x);
					
					var orbiting = Dist(myPos.x, myPos.y, hisPos.x, hisPos.y) < out.orbitDist;
					out.shoot = true;
					//out.angle = angle + (Math.PI/2 * Math.random() - Math.PI/4);
					out.angle = angle;


					if(orbiting){
						angle = angle + Math.PI/2 * (out.directionClockwise ? 1 : -1);
					}

					//if (distance < this.visionDistance){
					if(out.timeSinceLastChange < 0){
						out.timeSinceLastChange = out.timeBetweenChangesBase + (out.timeBetweenChangesVariable * Math.random() - out.timeBetweenChangesVariable/2);
						if(!orbiting)
							angle = angle + (Math.PI/2 * Math.random() - Math.PI/4);
						
						out.directionClockwise = !out.directionClockwise;
					}
					else if(!orbiting){
						angle = move.vec.getAngle();
					}

					move.vec.setX(100);
					move.vec.setAngle(angle);
					move.vec.setMag(out.speed);
				}
			}
		}
	}
		
};


SubSystems.SubSystemHumanInput = function(EntityMan){
	this.EM = EntityMan;

	this.keyMap = {
		87:"up",
		83:"down",
		65:"left",
		68:"right"
	};
	

	this.mouseMove = function(event){
		var x = event.pageX;
		var y = event.pageY;

		var ents = this.EM.getAllEntitiesWith("Input-Human");
		
		if(ents){
			for (var i = 0; i< ents.length; i++){
				var pos = this.EM.getComponent(ents[i], "Spatial");
				var input  = this.EM.getComponent(ents[i],"Input-Human");

				input.angle = Math.atan2(y-pos.y, x - pos.x);
			}	
		}	
	}


	this.mouseChange = function(value){
		var ents = this.EM.getAllEntitiesWith("Input-Human");
		
		if(ents){
			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				input.shoot = value;
			}
		}
	}


	this.keyDown = function(key){
		if ( this.keyMap[key.toString()] ){
			var dwn = this.keyMap[key.toString()];
			
			var ents = this.EM.getAllEntitiesWith("Input-Human");
			if(ents){
				for (var i = 0; i< ents.length; i++){
					var input  = this.EM.getComponent(ents[i],"Input-Human");
					if (input[dwn] == false){
						//console.log("DOwn -here");
						input[dwn] = true;
					}
				}
			}
		}
	};
	
	this.keyUp = function(key){
		if ( this.keyMap[key.toString()] ){
			var up = this.keyMap[key.toString()];

			var ents = this.EM.getAllEntitiesWith("Input-Human");
			if(ents){
				for (var i = 0; i< ents.length; i++){
					var input  = this.EM.getComponent(ents[i],"Input-Human");
					input[up] = false;
				}
			}
		}
	};	
	
	this.angleChange = function(angle){
		// alert(angle);
		var ents = this.EM.getAllEntitiesWith("Input-Human");
		if(ents){
			for (var i = 0; i< ents.length; i++){
				var pos = this.EM.getComponent(ents[i], "Spatial");
				var input  = this.EM.getComponent(ents[i],"Input-Human");
				
				var val;
				if(angle == -1){
					val = false;
				}
				else{
					val = true;
				}

				// alert(angle);
				input.angle = -Math.PI + angle;
				input.shoot = val;
			}	
		}	
	};

	this.touchMoveChange = function(angle){
		// alert("move")

		var ents = this.EM.getAllEntitiesWith("Input-Human");
		if(ents){
			for (var i = 0; i< ents.length; i++){
				var input  = this.EM.getComponent(ents[i],"Input-Human");

				if(angle == -1){
					input["up"] = false;
					input["down"] = false;
					input["left"] = false;
					input["right"] = false;
				}
				else{
					var threshold = Math.PI / 8;
					if(angle > 0 + threshold && angle < Math.PI - threshold){
						input["up"] = true;
					}
					else{
						input["up"] = false;
					}


					if(angle > Math.PI + threshold && angle < Math.PI*2 - threshold){
						input["down"] = true;
					}
					else{
						input["down"] = false;
					}

					if(angle > Math.PI/2 + threshold && angle < Math.PI * 3 /2 - threshold){
						input["right"] = true;
					}
					else{
						input["right"] = false;
					}

					if(angle < Math.PI/2 - threshold || angle > Math.PI * 3/2 + threshold){
						input["left"] = true;
					}
					else{
						input["left"] = false;
					}					
				}
			}
		}
	}
};

// function SubSystemAffectedByPlayer(EntityMan){
// 	this.EM = EntityMan;
// 	this.lastPlayerPosX = 'undefined';
// 	this.lastPlayerPosY = 'undefined';
	
// 	this.update = function(delta){
// 		var hPlayer = getCurrentPlayerName();
// 		if (hPlayer) {
// 			var pos = this.EM.getComponent(hPlayer, "Spatial");
// 			var posX = pos.x;
// 			var posY = pos.y;
// 		}
// 		else{
// 			var posX = 'undefined';
// 			var posY = 'undefined';
// 		}

// 		var ents = this.EM.getAllEntitiesWith("AffectedByPlayerMovement");
// 		if (ents){
// 			if (this.lastPlayerPosX == 'undefined' || this.lastPlayerPosY == 'undefined'){
// 				this.lastPlayerPosX = posX;
// 				this.lastPlayerPosY = posY;
// 				return;
// 			}
				
// 			if ( posX == 'undefined' || posY == 'undefined'){
// 				return;
// 			}
				
// 			var moveX = this.lastPlayerPosX - posX;
// 			var moveY = this.lastPlayerPosY - posY;
			
// 			this.lastPlayerPosX = posX;
// 			this.lastPlayerPosY = posY;
			
// 			for (var i = 0; i< ents.length; i++){
// 				var ent = ents[i];
// 				var pos = this.EM.getComponent(ent,"Spatial");

// 				aff = this.EM.getComponent(ent,"AffectedByPlayerMovement");
				
// 				pos.y += moveY / aff.d;
// 				pos.x += moveX / aff.d;
// 			}
// 		}
// 	};
// };



SubSystems.SubSystemCollisions = function(EntityMan){
	this.EM = EntityMan;


	this.update = function(delta){

		var ents = this.EM.getAllEntitiesWith("Collider");

		if (ents){
			for (var i = 0; i < ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponent(ent, "Renderer");
				var col = this.EM.getComponent(ent, "Collider");

				var w = pos.width;
				var h = pos.height;
				if (w == 0 || w == 'undefined'){//If our spatial component is invalid, just grab the render width and height
					w = rend.width;
					h = rend.height;
				}
				var x = pos.x;
				var y = pos.y;
				
				
				for (var j = 0; j< ents.length; j++){
					var nEnt = ents[j];	
					var nPos = this.EM.getComponent(nEnt,"Spatial");
					var nRend = this.EM.getComponent(nEnt, "Renderer");
					var nCol = this.EM.getComponent(nEnt, "Collider");

					if(col.channel !== nCol.channel){
						var nw = pos.width;
						var nh = pos.height;
						if (nw == 0 || nw == 'undefined'){//If our spatial component is invalid, just grab the render width and height
							nw = nRend.width;
							nh = nRend.height;
						}					
						var nx = nPos.x;
						var ny = nPos.y;
						
						//console.log(ent + "  " + nEnt);
						//console.log(x + " " + y + " " + nx + " " + ny + " " + w + " " + h + " " + nw + " " + nh);
						if (x + w / 2 > nx - nw / 2 && x - w / 2 < nx + nw/2 && y + h / 2 > ny - nh / 2 && y - h / 2 < ny + nh/2 && !(ent == nEnt)){//quick and dirty
						 	if(col.channel !== nCol.channel){
						 		this.EM.fireEntityEvent(ent, "Collision", {him:nEnt});
						 		this.EM.fireEntityEvent(nEnt, "Collision", {him:ent});
						 		
						 	}
						}
					}
					this.EM.flushRemoveList();

					if(!this.EM.entityExists(ent)){
						break;
					}
				}

				if(!this.EM.entityExists(ent)){
					i--;
					continue;
				}
				// this.EM.flushRemoveList();
			}
			// this.EM.flushRemoveList();
		}
	};
};


SubSystems.SubSystemLoseHealthOnHit = function(EntityMan){
	this.EM = EntityMan;
	var EM = this.EM;

	this.onHit = function(entity, eventData){
		if(EM.hasComponent(eventData.him, "Damager")){
			var dmg = EM.getComponent(eventData.him, "Damager").damage;

			var hp = EM.getComponent(entity, "Health");

			if(EM.hasComponent(entity, "Armor")){
				if(Math.random() > EM.getComponent(entity, "Armor").percent){
					hp.health -= dmg;
				}
			}
			else{
				hp.health -= dmg;
				
			}

			if(EM.hasComponent(entity, "Input-Human")){
				SM.play(HURT);
			}

			if(hp.health <= 0){
				EM.fireEntityEvent(entity, "Death");
				EM.addToRemoveList(entity);
			}
		}
	}

	this.EM.addEntityEventListner("Collision", "Health", this.onHit);
}

SubSystems.SubSystemDamaging = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		if (EM.hasComponent(eventData.him, "Health"))
			EM.addToRemoveList(entity);
	}

	this.EM.addEntityEventListner("Collision", "Damager", this.onHit);	
}


SubSystems.SubSystemDropXP = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		var drop = EM.getComponent(entity, "XPDropper").howMany;
		var pos = EM.getComponent(entity, "Spatial");

		for(var i = 0; i < drop; i++){
			Factory.CreateXP(pos.x, pos.y);
		}
	}

	this.EM.addEntityEventListner("Death", "XPDropper", this.onHit);	
}

SubSystems.SubSystemPickUpXP = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		if (EM.hasComponent(eventData.him, "XPContainer")){
			EM.getComponent(eventData.him, "XPContainer").xp += EM.getComponent(entity, "XPGiver").howMuch;
			SM.play(COIN_PICKUP, true, .1);
			EM.addToRemoveList(entity);
		}
	}

	this.EM.addEntityEventListner("Collision", "XPGiver", this.onHit);	
}



SubSystems.SubSystemAttractToHuman = function(EntityMan){
	this.EM = EntityMan;


	this.update = function(delta){

		var ents = this.EM.getAllEntitiesWith("AttractedToHuman");

		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var move = this.EM.getComponent(ent, "Movement");
				var attrObj = this.EM.getComponent(ent, "AttractedToHuman");

				var human = this.EM.getAllEntitiesWith("Input-Human")[0];
				if(human){
					var humanPos = this.EM.getComponent(human,"Spatial");

					if(Dist(pos.x, pos.y, humanPos.x, humanPos.y) < attrObj.dist){
						var angle = Math.atan2(humanPos.y - pos.y, humanPos.x - pos.x);
						var mag = attrObj.maxSpeed;
						move.vec.setX(mag * Math.cos(angle));
						move.vec.setY(mag * Math.sin(angle));
					}
					else{
						move.dec = move.origDec;
					}
				}
			}
		}
	};
};




SubSystems.SubSystemLeaveScreen = function(EntityMan, canvas){
	this.EM = EntityMan;
	this.canvas = canvas;

	this.update = function(delta){

		var ents = this.EM.getAllEntitiesWith("CantLeaveScreen");

		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var pos = this.EM.getComponent(ent,"Spatial");
				var rend = this.EM.getComponent(ent, "Renderer");

				if(pos.x + rend.width/2 > this.canvas.width){
					pos.x = this.canvas.width - rend.width/2;
				}
				else if(pos.x - rend.width/2 < 0){
					pos.x = 0 + rend.width/2;
				}

				if(pos.y + rend.height/2 > this.canvas.height){
					pos.y = this.canvas.height - rend.height/2;
				}
				else if(pos.y - rend.height/2 < 0){
					pos.y = 0 + rend.height/2;
				}				
			}
		}
	};
};


SubSystems.SubSystemDeleteAfterTime = function(EntityMan){
	this.EM = EntityMan;

	this.update = function(delta){

		var ents = this.EM.getAllEntitiesWith("DeleteAfterTime");

		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var timeObj = this.EM.getComponent(ent,"DeleteAfterTime");
				timeObj.timeLeft -= delta;
				if(timeObj.timeLeft < 0){
					this.EM.fireEntityEvent(ent, "TimeDeletion", {});
					this.EM.removeEntity(ent);
				}
			}
		}
	};
};

SubSystems.SubSystemDropHealth = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		var drop = EM.getComponent(entity, "HealthDropper").howMany;
		var pos = EM.getComponent(entity, "Spatial");

		for(var i = 0; i < drop; i++){
			Factory.CreateHealth(pos.x, pos.y);
		}
	}

	this.EM.addEntityEventListner("Death", "HealthDropper", this.onHit);	
}

SubSystems.SubSystemPickUpHealth = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		if (EM.hasComponent(eventData.him, "Health")){
			var hpObj = EM.getComponent(eventData.him, "Health")
			hpObj.health += EM.getComponent(entity, "HealthGiver").howMuch;

			if(hpObj.health > hpObj.startHealth){
				hpObj.health = hpObj.startHealth;
			}
			EM.addToRemoveList(entity);
		}
	}

	this.EM.addEntityEventListner("Collision", "HealthGiver", this.onHit);	
}

SubSystems.SubSystemHumanDeath = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		// RestartGame();
		console.log("End game detected. Restarted");
	}

	this.EM.addEntityEventListner("Death", "Input-Human", this.onHit);	
}

SubSystems.SubSystemEnemyDeath = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		console.log("You have killed an enemy");
		EnemySpawnManager.enemyDeath();
	}

	this.EM.addEntityEventListner("Death", "InputAndAIMovement", this.onHit);	
}


SubSystems.SubSystemExplodeOnTimeDeletion = function(EntityMan){
	this.EM = EntityMan;
	var EM = EntityMan;

	this.onHit = function(entity, eventData){
		var pos = EM.getComponent(entity, "Spatial");
		Factory.CreateExplosion(pos.x, pos.y);
	}

	this.EM.addEntityEventListner("TimeDeletion", "ExplodeOnTimeDeletion", this.onHit);	
}




SubSystems.SubSystemSizeIncreaser = function(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("SizeIncreaser");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent, "Renderer");
				var incr = this.EM.getComponent(ent, "SizeIncreaser");

				
				rend.width += incr.amount*delta;
				rend.height += incr.amount*delta;
			}
		}
	}
}


SubSystems.SubSystemShake = function(EntityMan){
	this.EM = EntityMan;
	
	this.update = function(delta){
		var ents = this.EM.getAllEntitiesWith("Shake");
		if (ents){
			for (var i = 0; i< ents.length; i++){
				var ent = ents[i];
				var rend = this.EM.getComponent(ent, "Renderer");
				var shake = this.EM.getComponent(ent, "Shake");

				if(!rend.rot){
					rend.rot = 0;
				}

				if(shake.velocity > 0)
					shake.velocity += delta*Math.PI/2;
				else
					shake.velocity -= delta*Math.PI/2;

				rend.rot += shake.velocity * delta;
				if(rend.rot < shake.minRot){
					rend.rot = shake.minRot;
					shake.velocity = -shake.velocity;
				}

				if(rend.rot > shake.maxRot){
					rend.rot = shake.maxRot;
					shake.velocity = -shake.velocity;
				}
			}
		}
	}
}


try {
	module.exports = SubSystems;
}
catch (e){

}