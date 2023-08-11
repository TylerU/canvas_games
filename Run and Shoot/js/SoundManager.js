// JavaScript Document

function SoundManager() {
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
  this.volume = .4;
}



SoundManager.prototype.queueDownload = function(path) {
  this.downloadQueue.push(path);
}



SoundManager.prototype.isDone = function() {
  return (this.downloadQueue.length == this.successCount + this.errorCount);
}



SoundManager.prototype.getAsset = function(path) {
	return this.cache[path];
}

SoundManager.prototype.play = function(path, synchron, relativeVol){
	if(PLAY_SOUNDS)	{
		// var clone = this.cache[path].cloneNode(true);
		var clone = this.cache[path];
		if(synchron){
			clone = this.cache[path].cloneNode(true);
		}
		if(relativeVol !== undefined){
			clone.volume = this.volume * relativeVol;
		}
		else{
			clone.volume = this.volume;
		}
		
		clone.play();//Memory leak or something?
		clone = null;
	// clone.parentNode.removeChild(clone);
	}
}


SoundManager.prototype.downloadAll = function(callback) {
	for (var i = 0; i < this.downloadQueue.length; i++) {	  
		var path = this.downloadQueue[i];
		var sound = new Audio(path);	  
		var that = this;
		
		sound.onload = function () {
			that.successCount += 1;
			if (that.isDone()) { callback(); }
		};	  
				
		sound.src = path;
		this.cache[path] = sound;
	}
}