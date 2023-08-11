// JavaScript Document

function AssetManager() {
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];
}



AssetManager.prototype.queueDownload = function(path) {
  this.downloadQueue.push(path);
}



AssetManager.prototype.isDone = function() {
  return (this.downloadQueue.length == this.successCount + this.errorCount);
}



AssetManager.prototype.getAsset = function(path) {
	return this.cache[path];
}


AssetManager.prototype.downloadAll = function(callback) {
	if (this.downloadQueue.length > 0){
		for (var i = 0; i < this.downloadQueue.length; i++) {	  
			var path = this.downloadQueue[i];
			var img = new Image();	  
			var that = this;
			
			img.onload = function () {
				that.successCount += 1;
				if (that.isDone()) { callback(); }
			};	  
					
			img.src = path;
			this.cache[path] = img;
		}
	}
	else{
		callback();
	}
}