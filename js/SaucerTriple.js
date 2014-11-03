'use strict';

// Cyan/grey saucer firing three successive shots with windup sound.

// constructor. Location is optional, default will be 0,0,0
var SaucerTriple = function(location)
{
  Saucer.call(this, SaucerTriple.MATERIAL1);

  if (typeof location !== 'undefined')
  {
    this.mesh.position.copy(location);
  }

  // override defaults
  this.SHOTS_TO_FIRE = 3;

  // new state for this type
  this.frameCounter = null; // current flicker timer
  this.isCyan = true;  // current cyan/grey flicker state

  log('new SaucerTriple at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerTriple.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
SaucerTriple.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerTriple.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
SaucerTriple.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerTriple.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames

SaucerTriple.prototype = Object.create(Saucer.prototype);

SaucerTriple.prototype.shoot = function()
{
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerTriple.SHOT_MATERIAL1, SaucerTriple.SHOT_MATERIAL2);
  State.actors.add(shot.actor);
};

// decorate default update() to add an alternating mesh material
SaucerTriple.update = function(timeDeltaMillis)
{
  SaucerTriple.material = (SaucerTriple.isCyan ? SaucerTriple.MATERIAL1 : SaucerTriple.MATERIAL2);

  SaucerTriple.frameCounter += 1;
  if (SaucerTriple.frameCounter === SaucerTriple.FLICKER_FRAMES)
  {
    SaucerTriple.isCyan = !SaucerTriple.isCyan;
    SaucerTriple.frameCounter = 0;
  } 

  var proto = Object.getPrototypeOf(SaucerTriple);
  proto.update.call(SaucerTriple, timeDeltaMillis);
};
