function Button(text, costF, comp, prop, amt){
	this.upgradeCost = costF;

	this.text = text;
	this.component = comp;
	this.property = prop;
	this.incrAmount = amt;

	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height =0;

	this.level = 1;
}

Button.prototype.setXYWH = function(x, y, w, h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}

Button.prototype.getNextCost = function(){
	return this.upgradeCost(this.level);
}

Button.prototype.draw = function(ctx){
	RenderObject({x:this.x, y:this.y, width:this.width, height:this.height, renderType:"Rectangle", color:{r:255,g:255,b:0}}, ctx);

	RenderObject({x:this.x - 60, y:this.y, width:this.width, height:this.height, renderType:"Text", text:this.text, font: "20px Times Newe Roman", color:{r:0,g:0,b:0}}, ctx);
	RenderObject({x:this.x - 60, y:this.y+15, width:this.width, height:this.height, renderType:"Text", text:"Level: " + this.level, font: "15px Times Newe Roman", color:{r:0,g:0,b:0}}, ctx);
	RenderObject({x:this.x + 20, y:this.y+15, width:this.width, height:this.height, renderType:"Text", text:"Cost: " + this.getNextCost(), font: "15px Times Newe Roman", color:{r:0,g:0,b:0}}, ctx);
}

Button.prototype.click = function(){
	var player = getPlayer();
	if(player){
		var xpObj = EntityManager.getComponent(player, "XPContainer");
		var amt = this.getNextCost();
		if(xpObj.xp >= amt || FREE_UPGRADES){
			console.log("Armor Upgraded");

			//if(EntityManager.getComponent(player, this.component)[this.property] < this.max){
				EntityManager.getComponent(player, this.component)[this.property] += this.incrAmount;
				xpObj.xp -= amt;
				this.level++;
				UI.draw();
			//}
		}
	}
		
}



var UI = (function(){
	//Private variables
	var UICanvas;
	var UICtx;
	
	var active = true;

	// var buttons = [];
	var drawables = [];
	var oldUpgrades = [];


	//Private functions

	function loadUI(upgrades){
		//Background
		drawables.push({x:UICanvas.width/2, y:UICanvas.height/2 + 30, width:UICanvas.width-100, height:UICanvas.height-200, renderType:"Rectangle", color:{r:245,g:178,b:54}});
		oldUpgrades = upgrades;

		//First button

		var startX = 150;
		var startY = 180;
		var width = 200;
		var height = 70;
		var ROWS = 5;
		var COLS = Math.floor(UICanvas.width / (width+50));
		console.log(COLS)

		for(var i = 0; i < upgrades.length; i++){
			var row = Math.floor(i/COLS);
			var col = i%COLS;

			upgrades[i].setXYWH(startX + col*width, startY + row*height, 150, 50);
			drawables.push(upgrades[i]);
			// drawables.push({x:startX + col*width, y:startY + row*height, width:150, height:50, renderType:"Rectangle", color:{r:255,g:255,b:0}, click:upgrades[i].click});

			// drawables.push({x:startX + col*width - 60, y:startY + row*height, width:100, height:100, renderType:"Text", text:upgrades[i].text, font: "20px Times Newe Roman", color:{r:0,g:0,b:0}});
			// drawables.push({x:startX + col*width - 60, y:startY + row*height + 20, width:100, height:100, renderType:"Text", text:"Cost: 10", font: "15px Times Newe Roman", color:{r:0,g:0,b:0}});
			// drawables.push({x:startX + col*width - 60, y:startY + row*height + 20, width:100, height:100, renderType:"Text", text:"Level: 1", font: "15px Times Newe Roman", color:{r:0,g:0,b:0}});
		}


	}

	//Functions and public variables
	var obj = {};

	obj.refreshSize = function (){
		drawables = [];
		loadUI(oldUpgrades);
	}

	obj.resetLevels = function(){
		for(var i = 0; i < drawables.length; i++){
			if(drawables[i].level){
				drawables[i].level = 1;
			}
		}
	}

	obj.draw = function(){
		UICtx.clearRect(0,0, UICtx.canvas.width, UICtx.canvas.height);

		for(var i = 0; i < drawables.length; i++){
			if(drawables[i].draw){
				drawables[i].draw(UICtx);
			}
			else{
				RenderObject(drawables[i], UICtx);
			}
		}	

		// for(var i = 0; i < buttons.length; i++){
		// 	RenderObject(buttons[i], UICtx);
		// }			
	}

	obj.init = function(canvas, upgrades){
		UICanvas = canvas;
		UICtx = UICanvas.getContext("2d");
		loadUI(upgrades);
		this.draw();
		this.hide();
	}

	obj.hide = function(){
		UICanvas.style.display = "none";
		active = false;
	}

	obj.show = function(){
		UICanvas.style.display = "block";
		active = true;
	}

	obj.mouseChange = function(value, x, y){
		if(value && active){//Clicked
			for(var i = 0; i < drawables.length; i++){
				var b = drawables[i];

				if(x > b.x - b.width/2 && x < b.x + b.width/2 && y > b.y - b.height/2 && y < b.y + b.height/2){
					if(b.click)
						b.click();
				}
			}			

		}
	}

	return obj;
})();