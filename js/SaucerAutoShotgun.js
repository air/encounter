'use strict';

// Lightgrey saucer firing 3 consecutive shotgun blasts with no warning.

// constructor. Location is optional, default will be 0,0,0
var SaucerAutoShotgun = function(location)
{
  Saucer.call(this, SaucerAutoShotgun.MATERIAL);

  if (typeof location !== 'undefined')
  {
    this.mesh.position.copy(location);
  }

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;
  this.SHOTS_TO_FIRE = 3;
  this.SHOT_INTERVAL_MS = 500;

  log('new SaucerAutoShotgun at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerAutoShotgun.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerAutoShotgun.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerAutoShotgun.SHOT_SPREAD = 0.05;

SaucerAutoShotgun.prototype = Object.create(Saucer.prototype);

SaucerAutoShotgun.prototype.shoot = function()
{
  Sound.enemyShoot();

  // shot 1 directly at player
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  var shotMiddle = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerAutoShotgun.SHOT_MATERIAL);
  // shot 2 to the right of target
  this.mesh.rotation.y -= SaucerAutoShotgun.SHOT_SPREAD;
  var shotRight = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerAutoShotgun.SHOT_MATERIAL);
  // shot 3 to the left
  this.mesh.rotation.y += (SaucerAutoShotgun.SHOT_SPREAD * 2);
  var shotLeft = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerAutoShotgun.SHOT_MATERIAL);

  State.actors.add(shotMiddle.actor);
  State.actors.add(shotRight.actor);
  State.actors.add(shotLeft.actor);
};
