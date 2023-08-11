var Buttons = (function(){
	//Private Variables

	var _buttons = {};//hash map of all buttons
    
    var _cnvs = document.createElement('canvas');
    var _cntx = _cnvs.getContext('2d');

    _cnvs.width = window.innerWidth; 
    _cnvs.height = window.innerHeight;
	//END Private Variables
	_cnvs.width = window.innerWidth;
	_cnvs.height = window.innerHeight;
	_cnvs.style.position = 'relative';
	_cnvs.style.left = '0px';
	_cnvs.style.top = '0px';
	_cnvs.style.zIndex = '10';

	document.body.appendChild(_cnvs);

	//Defines the Button object!
	var CreateButton = function( description ){
		//Private variables
		var _x = description.x;
		var _y = description.y;
		var _width = description.width || AM.getAsset(description.image).width;
		var _height = description.height || AM.getAsset(description.image).height || description.width;
		var _renderOptions = description;
		var _callback = description.callback;


		//End private variables

		var obj = {
			x: description.x,
			y: description.y,
			width: _width,
			height: _height,
			callback: _callback,
			draw: function(){
				RenderObject(_renderOptions, _cntx);
				if (_renderOptions.text)
					RenderObject(_renderOptions.text, _cntx);
			}
		};

		return obj;
	};

	var _drawButtons = function(){
		_cntx.clearRect(0,0, _cnvs.width, _cnvs.height);
		for (var btn in _buttons){
			if (_buttons.hasOwnProperty(btn)){
				_buttons[btn].draw();
			}
		}
	};

	var _checkForClick = function(e) {
		for (var btn in _buttons){
			if (_buttons.hasOwnProperty(btn)){
				var curBtn = _buttons[btn];

				if (curBtn.x - curBtn.width/2 < e.clientX && curBtn.x + curBtn.width/2 > e.clientX && curBtn.y - curBtn.height/2 < e.clientY && curBtn.y + curBtn.height/2 > e.clientY){
					curBtn.callback();
				}
			}
		}
	};

	var obj = {
		//Public variables and functions
		addButton: function( buttonObj ){
			var btn = CreateButton(buttonObj);

			_buttons[buttonObj.ID] = btn;

			_drawButtons();
		},
		removeButton: function(buttonID){
			delete _buttons[buttonID];
		},
		updateCanvasSize: function( w, h){
			_cnvs.width = w;
			_cnvs.height = h;
			_drawButtons();
		},
		getButton: function(buttonID){
			return _buttons[buttonID];
		},
		//End Public variables and functions
	};

	addEventListener("mousedown", _checkForClick, false);

	//Initialize
	return obj;

})();