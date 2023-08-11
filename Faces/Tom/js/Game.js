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
var img = "images/Tom.png";
AM.queueDownload(img);
var draw = false;
AM.downloadAll(function(){draw = true;});
var sizeModifier = .2;

window.addEventListener("mousemove", function(e){
	if (draw){
		var asset = AM.getAsset(img);
		ctx.drawImage(asset, e.clientX - asset.width/2*sizeModifier, e.clientY - asset.height/2*sizeModifier, asset.width * sizeModifier, asset.height * sizeModifier);
	}
}, false);