'use strict';

// Cyan/grey saucer firing three successive shots with windup sound.

// constructor. Location is optional, default will be 0,0,0
var SaucerTriple = function(location)
{
  Saucer.call(this, SaucerTriple.MATERIAL, location);

  // override defaults
  this.SHOTS_TO_FIRE = 3;

  log('new SaucerTriple at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerTriple.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
SaucerTriple.MATERIAL = new MY3.FlickeringBasicMaterial([C64.cyan, C64.lightgrey], SaucerTriple.FLICKER_FRAMES);
SaucerTriple.SHOT_MATERIAL = new MY3.FlickeringBasicMaterial([C64.cyan, C64.lightgrey], SaucerTriple.FLICKER_FRAMES);

SaucerTriple.prototype = Object.create(Saucer.prototype);

SaucerTriple.prototype.shoot = function()
{
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerTriple.SHOT_MATERIAL);
  State.actors.add(shot.actor);
};
