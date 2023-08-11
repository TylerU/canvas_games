define([
  'lib/underscore',
  'RenderObject',
  'mathHelpers'
], function(
  _,
  RenderObject,
  MathHelpers
  ){

  function Planet(x, y, width, owner) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.renderType = 'Circle';
    this.owner = owner;
    this.color = this.owner.getColor();

    this.population = 1;
    this.timeUntilNextPopulation = this.getTimeUntilNextPopulation();
  }

  Planet.prototype.getWidth = function() {
    return this.width;
  };

  Planet.prototype.getTimeUntilNextPopulation = function() {
    var multiple = 30;
    return multiple / this.width;
  };

  Planet.prototype.render = function(context) {
    RenderObject(this, context);
    RenderObject(this.getTextRenderObject(), context);
  };

  Planet.prototype.getTextRenderObject = function() {
    var size = 14;
    return {
      x: this.x,
      y: this.y + size / 2 - size/6,
      renderType: 'Text',
      text: this.population,
      font: size + 'px Helvetica',
      centerText: true
    };
  };

  Planet.prototype.update = function(delta) {
    this.timeUntilNextPopulation -= delta;
    while(this.timeUntilNextPopulation <= 0) {
      this.addPopulation();
      this.timeUntilNextPopulation += this.getTimeUntilNextPopulation();
    }
  };

  Planet.prototype.addPopulation = function() {
    this.population++;
  };

  Planet.prototype.getPosition = function() {
    return {x: this.x, y: this.y};
  };


  function Selection() {
    this.ents = [];
    this.destination = {x: 0, y: 0};
  }

  Selection.prototype.addEntity = function(ent) {
    if (!_.contains(this.ents, ent)) {
      this.ents.push(ent);
    }
  };

  Selection.prototype.getEntities = function() {
    return this.ents;
  };

  Selection.prototype.setDestination = function(x, y) {
    this.destination = {
      x: x,
      y: y
    };
  };


  function SelectionRenderer(selection) {
    this.model = selection;
  }

  SelectionRenderer.prototype.render = function(context) {
    _.each(this.model.getEntities(), function(ent, index) {
      RenderObject({
        x: ent.getPosition().x,
        y: ent.getPosition().y,
        lineWidth: 10,
        width: ent.getWidth() + 20,
        color: {r: 0, g: 255, b: 0},
        renderType: 'CircleOutline'
      }, context);

      RenderObject({
        renderType: "Line",
        end: {x: this.model.destination.x, y: this.model.destination.y},
        start: {x: ent.getPosition().x, y: ent.getPosition().y},
        color: {r: 0, g: 0, b: 0},
      }, context);
    }, this);

    RenderObject({
      x: this.model.destination.x,
      y: this.model.destination.y,
      renderType: "Rectangle",
      width: 10,
      color: {r:0,g:0,b:0}
    }, context);
  };

  SelectionRenderer.prototype.getModel = function() {
    return this.model;
  };


  var context;
  var canvas;
  var curSelection = null;

  $(function() {
    canvas = $('#game')[0];

    canvas.width = window.innerWidth; //document.width is obsolete
    canvas.height = window.innerHeight; //document.height is obsolete

   context = canvas.getContext('2d');
  });

  var then = 0;



  var Game = {
    planets: [],

    people: [],

    selection: null,

    mouseDown: function(evt) {
      if(!this.selection)
        this.selection = new SelectionRenderer(new Selection());
    },

    mouseMove: function(evt) {
      if (!this.selection) return;
      var x = evt.x;
      var y = evt.y;

      _(this.planets).chain()
        .filter(function(planet) {
          return MathHelpers.Dist(planet.getPosition().x, planet.getPosition().y, x, y) <= planet.getWidth();
        })
        .filter(function(planet) {
          return planet.owner == this.people[0];
        }, this)
        .each(function(planet) {
          this.selection.getModel().addEntity(planet);
        }, this);

      _(this.planets).chain()
        .filter(function(planet) {
          return MathHelpers.Dist(planet.getPosition().x, planet.getPosition().y, x, y) <= planet.getWidth();
        })
        .each(function(planet) {
          this.selection.getModel().setDestination(planet.x, planet.y);
        }, this);

      this.selection.getModel().setDestination(x,y);
    },

    mouseUp: function(evt) {
      this.selection = null;
    },

    main: function() {
      var now = Date.now();
      var delta = now - then;
      delta /= 1000;
      then = now;

      context.clearRect(0,0,canvas.width, canvas.height);

      _.each(this.planets, function(planet) {
        planet.render(context);
      });
      _.each(this.planets, function(planet) {
        planet.update(delta);
      });

      if (this.selection) this.selection.render(context);

      window.requestAnimFrame(this.main.bind(this));
    },

    start: function() {
      var player = {
        getColor: function() {
          return {r: 255, g: 0, b: 0};
        }
      };
      var player2 = {
        getColor: function() {
          return {r: 0, g: 255, b: 0};
        }
      };
      this.people.push(player);
      this.people.push(player2);
      this.planets.push(new Planet(100, 100, 50, this.people[0]));
      this.planets.push(new Planet(200, 200, 50, this.people[0]));
      this.planets.push(new Planet(400, 200, 50, this.people[0]));
      this.planets.push(new Planet(200, 400, 50, this.people[0]));
      this.planets.push(new Planet(400, 400, 50, this.people[1]));

      then = Date.now();
      window.requestAnimFrame(this.main.bind(this));
    }
  };

  var $canvas = $(canvas);

  function getMouseCoords(evt) {
    return {
      x: evt.clientX,
      y: evt.clientY
    }
  }

  $canvas.on('mousemove', function(evt) {
    Game.mouseMove(getMouseCoords(evt))
  });

  $canvas.on('mousedown', function(evt) {
    Game.mouseDown(getMouseCoords(evt))
  });

  $canvas.on('mouseup', function(evt) {
    Game.mouseUp(getMouseCoords(evt))
  });

  $canvas.on('touchstart', function(evt) {
    Game.mouseDown(getMouseCoords(evt.originalEvent.changedTouches[0]));
    evt.preventDefault();
  });

  $canvas.on('touchend', function(evt) {
    Game.mouseUp(getMouseCoords(evt.originalEvent.changedTouches[0]));
    evt.preventDefault();
  });

  $canvas.on('touchmove', function(evt) {
    Game.mouseMove(getMouseCoords(evt.originalEvent.changedTouches[0]));
    evt.preventDefault();
  });

  return Game;
});
