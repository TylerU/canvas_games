// JavaScript Document
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


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
var face = "images/ShrekFace.png";
var body = "images/Shrek.jpg";
AM.queueDownload(face);
AM.queueDownload(body);

var canDraw = false;
var draw = false;

AM.downloadAll(function(){
	var asset = AM.getAsset(body);
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("tickle the nos", 50, canvas.height - 420);

	ctx.drawImage(asset, 0, canvas.height - asset.height);
	canDraw = true;
});

var pos = {x: 90, y: 344};

window.addEventListener("mousemove", function(e){
	var x = e.clientX;
    var y = e.clientY;
    if (draw){
		var asset = AM.getAsset(face);
		ctx.drawImage(asset, x - asset.width/2, y - asset.height/2);
	}
    else {
        if (canDraw) {
            tolerance = 10;
            if(Math.abs(x - pos.x) < tolerance && Math.abs(y - (canvas.height - pos.y)) < tolerance){
                canvas.style.cursor = "none";
                ctx.font = "30px Comic Sans MS";
                var fx = 300;
                ctx.fillText("check urself", fx, canvas.height - 270);
                ctx.fillText("before", fx, canvas.height - 230);
                ctx.fillText("u shrek urself", fx, canvas.height - 190);
                draw = true;
            }
            
        }
        else {
            // Wait
        }
    }
}, false);
