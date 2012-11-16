// Adapted from THREE.FirstPersonControls

// TODO crosshairs, translucent

SimpleControls = function (object, domElement) {
  this.object = object;
  this.domElement = (domElement !== undefined) ? domElement : document;

  this.movementSpeed = 1.0;
  this.turnSpeed = 0.005;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;

  this.turnLeft = false;
  this.turnRight = false;

  this.canStrafe = false;

  if (this.domElement !== document) {
    this.domElement.setAttribute('tabindex', -1);
  }

  this.onKeyDown = function (event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        if (this.canStrafe) {
          this.moveLeft = true;
        } else {
          this.turnLeft = true;
        }
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        if (this.canStrafe) {
          this.moveRight = true;
        } else {
          this.turnRight = true;
        }
        break;
    }
  };

  this.onKeyUp = function (event) {
    switch(event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        this.turnLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        this.turnRight = false;
        break;
    }
  };

  this.update = function(delta) {
    // move
    var actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward) this.object.translateZ(- actualMoveSpeed);
    if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

    if (this.moveLeft) this.object.translateX(- actualMoveSpeed);
    if (this.moveRight) this.object.translateX(actualMoveSpeed);

    // rotate
    if (!this.canStrafe) {
      var actualTurnSpeed = delta * this.turnSpeed;
      if (this.turnRight) {
        this.object.rotation.y -= actualTurnSpeed;
      }
      else if (this.turnLeft) {
        this.object.rotation.y += actualTurnSpeed;
      }
    }
  };

  this.domElement.addEventListener('keydown', bind(this, this.onKeyDown), false);
  this.domElement.addEventListener('keyup', bind(this, this.onKeyUp), false);

  function bind(scope, fn) {
    return function () {
      fn.apply(scope, arguments);
    };
  };

};
