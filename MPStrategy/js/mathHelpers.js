define(function(){

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

  return {
    RandomClamped: RandomClamped,
    RandomClampedInt: RandomClampedInt,
    ToRadians: ToRadians,
    AngleBetween: AngleBetween,
    AngleBetweenDot: AngleBetweenDot,
    Dot: Dot,
    DistOptimized: DistOptimized,
    Dist: Dist
  };

});