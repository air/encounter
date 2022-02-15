import { log, error, panic } from '/js/UTIL.js';

// Lightgreen saucer that fires a shotgun blast of 3 shots with no warning.

// constructor. Location is optional, default will be 0,0,0
var SaucerShotgun = function(location)
{
  Saucer.call(this, SaucerShotgun.MATERIAL, location);

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;

  log('new SaucerShotgun at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerShotgun.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.lightgreen });
SaucerShotgun.SHOT_MATERIAL = SaucerShotgun.MATERIAL;
SaucerShotgun.SHOT_SPREAD = 0.05;

SaucerShotgun.prototype = Object.create(Saucer.prototype);

SaucerShotgun.prototype.shoot = function()
{
  Sound.enemyShoot();

  // shot 1 directly at player
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  var shotMiddle = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerShotgun.SHOT_MATERIAL);
  // shot 2 to the right of target
  this.mesh.rotation.y -= SaucerShotgun.SHOT_SPREAD;
  var shotRight = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerShotgun.SHOT_MATERIAL);
  // shot 3 to the left
  this.mesh.rotation.y += (SaucerShotgun.SHOT_SPREAD * 2);
  var shotLeft = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerShotgun.SHOT_MATERIAL);

  State.actors.add(shotMiddle.actor);
  State.actors.add(shotRight.actor);
  State.actors.add(shotLeft.actor);
};
