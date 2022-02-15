import { log, error, panic } from '/js/UTIL.js';

// The first enemy, a yellow saucer firing one shot with windup sound.

// constructor. Location is optional, default will be 0,0,0
var SaucerSingle = function(location)
{
  Saucer.call(this, SaucerSingle.MATERIAL, location);

  log('new SaucerSingle at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerSingle.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerSingle.SHOT_MATERIAL = SaucerSingle.MATERIAL;

SaucerSingle.prototype = Object.create(Saucer.prototype);

SaucerSingle.prototype.shoot = function()
{
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerSingle.SHOT_MATERIAL);
  State.actors.add(shot.actor);
};
