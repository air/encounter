'use strict';

// Yellow/grey saucer firing 10 consecutive shots with no warning.

// constructor. Location is optional, default will be 0,0,0
var SaucerChaingun = function(location)
{
  Saucer.call(this, SaucerChaingun.MATERIAL);

  if (typeof location !== 'undefined')
  {
    this.mesh.position.copy(location);
  }

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;
  this.SHOTS_TO_FIRE = 10;
  this.SHOT_INTERVAL_MS = 300;

  log('new SaucerChaingun at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerChaingun.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
SaucerChaingun.MATERIAL = new MY3.FlickeringBasicMaterial([C64.yellow, C64.lightgrey], SaucerChaingun.FLICKER_FRAMES);
SaucerChaingun.SHOT_MATERIAL = new MY3.FlickeringBasicMaterial([C64.yellow, C64.lightgrey], SaucerChaingun.FLICKER_FRAMES);

SaucerChaingun.prototype = Object.create(Saucer.prototype);

SaucerChaingun.prototype.shoot = function()
{
  Sound.enemyShoot();
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  var shot = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerChaingun.SHOT_MATERIAL);
  State.actors.add(shot.actor);
};
