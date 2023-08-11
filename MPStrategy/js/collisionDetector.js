define(function(){
  var getRectWidth = function(rect){
    return rect.width;
  };

  var getRectHeight = function(rect){
    return rect.height || rect.width;
  };

  var getRectX = function(rect){
    return rect.x;
  };

  var getRectY = function(rect){
    return rect.y;
  };

  var getRectBoundaries = function(rect){
    var x = getRectX(rect);
    var y = getRectY(rect);
    var width = getRectWidth(rect);
    var height = getRectHeight(rect);

    return {
      leftX : x - width/2,
      rightX : x + width/2,
      topY : y - height/2,
      bottomY : y + height/2
    }
  };

  var detector = {

    RectRectCollide : function(rect1, rect2){
      var rectBoundaries1 = getRectBoundaries(rect1);
      var rectBoundaries2 = getRectBoundaries(rect2);

      var leftX = rectBoundaries1.leftX;
      var rightX = rectBoundaries1.rightX;
      var topY = rectBoundaries1.topY;
      var bottomY = rectBoundaries1.bottomY;

      var lX = rectBoundaries2.leftX;
      var rX = rectBoundaries2.rightX;
      var tY = rectBoundaries2.topY;
      var bY = rectBoundaries2.bottomY;


      if ( rightX > lX && leftX < rX && bottomY > tY && topY < bY){ //COLLISION
        return true;
      }
      else{
        return false;
      }

    },

    //Rect has an x, y, width, and height.
    //P1 and P2 are the end points of the line segment to test collision with
    RectSegCollide : function (rect, line){
      var p1x = line.p1.x;
      var p1y = line.p1.y;
      var p2x = line.p2.x;
      var p2y = line.p2.y;

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
    },

    RectPointCollide : function(rect, point){
      var rectBoundaries1 = getRectBoundaries(rect);

      var leftX = rectBoundaries1.leftX;
      var rightX = rectBoundaries1.rightX;
      var topY = rectBoundaries1.topY;
      var bottomY = rectBoundaries1.bottomY;

      var x = point.x;
      var y = point.y;


      if ( rightX > x && leftX < x && bottomY > y && topY < y){ //COLLISION
        return true;
      }
      else{
        return false;
      }
    }
  };

  return detector;
});
