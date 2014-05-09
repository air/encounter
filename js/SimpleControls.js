'use strict';

// SimpleControls.js handles movement only. For other functions see Keys.js
// Adapted from THREE.FirstPersonControls

// TODO crosshairs, translucent

var SimpleControls = function(controlledObject)
{
  this.object = controlledObject;

  // for affecting Player state
  this.movementSpeed = 1.0;
  this.turnSpeed = 0.005;

  // binary states of the controls
  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.turnLeft = false;
  this.turnRight = false;

  // config: does left/right rotate, or strafe?
  this.canStrafe = false;
  // config: is forward/back acceleration out of the player's control?
  this.accelerationFixed = false;

  function keyDown(event)
  {
    switch (event.keyCode)
    {
      case 38: // up
      case 87: // w
        if (!this.accelerationFixed)
        {
          this.moveForward = true;
        }
        break;

      case 37: // left
      case 65: // a
        if (this.canStrafe)
        {
          this.moveLeft = true;
        }
        else
        {
          this.turnLeft = true;
        }
        break;

      case 40: // down
      case 83: // s
        if (!this.accelerationFixed)
        {
          this.moveBackward = true;
        }
        break;

      case 39: // right
      case 68: // d
        if (this.canStrafe)
        {
          this.moveRight = true;
        }
        else
        {
          this.turnRight = true;
        }
        break;
    }
  };

  function keyUp(event)
  {
    switch(event.keyCode)
    {
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

  this.update = function(timeDeltaMillis)
  {
    // move the player
    var actualMoveSpeed = timeDeltaMillis * this.movementSpeed;

    if (this.moveForward || this.accelerationFixed)
    {
      this.object.translateZ(- actualMoveSpeed);
    }
    
    if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

    // these will only be true if this.canStrafe
    if (this.moveLeft) this.object.translateX(- actualMoveSpeed);
    if (this.moveRight) this.object.translateX(actualMoveSpeed);

    // rotate player
    if (!this.canStrafe)
    {
      var actualTurnSpeed = timeDeltaMillis * this.turnSpeed;
      if (this.turnRight)
      {
        this.object.rotation.y -= actualTurnSpeed;
      }
      else if (this.turnLeft)
      {
        this.object.rotation.y += actualTurnSpeed;
      }
    }
  };

  document.addEventListener('keydown', keyDown.bind(this), false);
  document.addEventListener('keyup', keyUp.bind(this), false);
};

