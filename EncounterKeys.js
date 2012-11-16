// TODO might need to re-add the domElement stuff from SimpleControls.js

EncounterKeys = function() {

  this.shooting = false;

  this.onKeyUp = function (event) {
    switch(event.keyCode) {
      case 70: // f
        initFlyControls();
        console.info('switched to fly controls');
        break;
      case 32: // space
      case 90: // z
        this.shooting = false;
        break;
    }
  };

  this.onKeyDown = function (event) {
    switch(event.keyCode) {
      case 32: // space
      case 90: // z
        this.shooting = true;
        break;
    }
  };

  document.addEventListener('keydown', bind(this, this.onKeyDown), false);
  document.addEventListener('keyup', bind(this, this.onKeyUp), false);

  function bind(scope, fn) {
    return function () {
      fn.apply(scope, arguments);
    };
  };

};
