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
  // decorate default update() to add an alternating mesh material
  var self = this;
  var defaultUpdateFunction = this.actor.update;
  var decoratedUpdate = function(timeDeltaMillis)
  {
    // this = Actor
    // self = SaucerTriple
    this.object3D.material = (self.isCyan ? SaucerTriple.MATERIAL1 : SaucerTriple.MATERIAL2);

    self.frameCounter += 1;
    if (self.frameCounter === SaucerTriple.FLICKER_FRAMES)
    {
      self.isCyan = !self.isCyan;
      self.frameCounter = 0;
    } 

    defaultUpdateFunction.call(this, timeDeltaMillis);
  };
  this.actor.update = decoratedUpdate;

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