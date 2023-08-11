define(function() {
  var RenderObject = function(rend, drawingContext){
    var currentCtx = (drawingContext !== undefined) ? drawingContext : ctx;

    if ( (rend.visible == undefined) ? true : rend.visible){
      currentCtx.save();
      if (rend.x != undefined && rend.y != undefined)
        currentCtx.translate(rend.x, rend.y);
      else if (rend.loc != undefined)
        currentCtx.translate(rend.loc.getX(), rend.loc.getY());
      else
//        console.log("ERROR: No valid location to draw object");

      currentCtx.rotate(rend.rot);
      currentCtx.scale( rend.flip ? -1 : 1,1);
      var h = ((rend.height) ? rend.height : rend.width)/2;
      var w = rend.width/2;

      if (rend.color){
        var color = "rgb(" + rend.color.r + "," + rend.color.g + "," + rend.color.b + ")";
      }
      else{
        var color = "rgb(255,255,255)";//If no color is in the object, render it white
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
        case "Line":
          currentCtx.beginPath();
          currentCtx.moveTo(rend.start.x, rend.start.y);
          currentCtx.lineTo(rend.end.x, rend.end.y);
          currentCtx.stroke();
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
          var imgHeight = asset.height;
          var imgWidth = asset.width;
          if(rend.useGivenSize){
            imgHeight = h*2;
            imgWidth = w*2;
          }
          currentCtx.drawImage(asset, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
          break;
        case "CircleOutline":
          currentCtx.beginPath();
          currentCtx.arc(0, 0, w, 0, Math.PI * 2);
          currentCtx.lineWidth = rend.lineWidth || 10;

          // line color
          currentCtx.strokeStyle = color;
          currentCtx.stroke();
          break;
        case "RectangleOutline":

          break;
        case "Sprite":
          var asset = AM.getAsset(rend.image);
          currentCtx.drawImage(asset, rend.curFrame.x, rend.curFrame.y, rend.spriteWidth, rend.spriteHeight, -rend.spriteWidth/2, -rend.spriteHeight/2, rend.spriteWidth*(rend.scale || 1), rend.spriteHeight*(rend.scale || 1));//Draws at the image's size, not at the given size
          break;
        case "Text":
          currentCtx.fillStyle = color;
          currentCtx.font = rend.font;
          if (rend.centerText) {
            currentCtx.textAlign = 'center';
          }
          currentCtx.fillText(rend.text, 0,0);
          break;
      }
      currentCtx.restore();
    }
  };

  return RenderObject;
});