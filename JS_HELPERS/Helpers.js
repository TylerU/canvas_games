Number.prototype.clamp = function(min, max) {
  	 return Math.min(Math.max(this, min), max);
};


var Clone = function(obj) {
  var newObj = (obj instanceof Array) ? [] : {};
  for (i in obj) {
    if (i == 'clone') continue;
    if (obj[i] && typeof obj[i] == "object") {
      newObj[i] = Clone(obj[i]);
    } else newObj[i] = obj[i]
  } return newObj;
};


function RandomClamped(minimum, maximum){
	return minimum + Math.random() * (maximum - minimum);
}

function RandomClampedInt(minimum, maximum){
	return Math.floor(minimum + Math.random() * (maximum - minimum));
}


function ToRadians(deg){
	return deg / 180 * 3.1415926536;
}


function AngleBetween(x,y,x1,y1){	
	var mag =  Math.sqrt(x*x + y*y);
	var mag1 =  Math.sqrt(x1*x1 + y1*y1);
		
	var normX = x / mag;
	var normY = y / mag;
	
	var normX1 = x1 / mag1;
	var normY1 = y1 / mag1;

	var angle =  (Math.atan2(normY,normX)  - Math.atan2(normY1,normX1));	
	return angle;
}

function Dist(x, y, x2, y2) {
	// TODO Auto-generated method stub
	var dist =  Math.sqrt((x-x2) * (x-x2) + (y-y2) * (y-y2));
	return dist;
}

//Return the distance before square rooting...WILL NOT BE THE ACTUAL DISTANCE BETWEEN POINTS
//Rather, this is a fast way to compare distances
function DistOptimized(x, y, x2, y2) {
	var dist =  (x-x2) * (x-x2) + (y-y2) * (y-y2);
	return dist;
}

function Dot(x, y, x1, y1){
	var mag =  Math.sqrt(x*x + y*y);
	var mag1 =  Math.sqrt(x1*x1 + y1*y1);
		
	var normX = x / mag;
	var normY = y / mag;
	
	var normX1 = x1 / mag1;
	var normY1 = y1 / mag1;
	
	var dotProd = normX*normX1 + normY*normY1;
	
	return dotProd;
}

function AngleBetweenDot(x,y,x1,y1){	
	return Math.acos(Dot(x,y,x1,y1));
}


function isCollision(rect1, rect2){
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



//Rect has an x, y, width, and height. 
//P1 and P2 are the end points of the line segment to test collision with
function RectSegCollide(rect, p1x, p1y, p2x, p2y){
    var minX = p1x;
    var maxX = p2x;
    
    if (p1x > p2x) {
        minX = p2x;
        maxX = p1x;
    }
    
    if (maxX > rect.x + rect.width/2)
        maxX = rect.x + rect.width/2;
    
    if (minX < rect.x-rect.width/2)
        minX = rect.x-rect.width/2;
    
    if (minX > maxX)
        return false;
    
    var minY = p1y;
    var maxY = p2y;
    
    var dx = p2x - p1x;
    
    if (Math.abs(dx) > 0.0000001) {
        var a = (p2y - p1y) / dx;
        var b = p1y - a * p1x;
        minY = a * minX + b;
        maxY = a * maxX + b;
    }
    
    if (minY > maxY) {
        var tmp = maxY;
        maxY = minY;
        minY = tmp;
    }
    
    if (maxY > rect.y + rect.height/2)
        maxY = rect.y + rect.height/2;
    
    if (minY < rect.y-rect.height/2)
        minY = rect.y - rect.height/2;
    
    if (minY > maxY)
        return false;
    
    return true;
}

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


if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

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




