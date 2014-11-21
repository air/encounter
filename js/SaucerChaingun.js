'use strict';

// Yellow/grey saucer firing 10 consecutive shots with no warning.

// constructor. Location is optional, default will be 0,0,0
var SaucerChaingun = function(location)
{
  Saucer.call(this, SaucerChaingun.MATERIAL1);

  if (typeof location !== 'undefined')
  {
    this.mesh.position.copy(location);
  }

  // override defaults
  this.PERFORMS_SHOT_WINDUP = false;
  this.SHOTS_TO_FIRE = 10;
  this.SHOT_INTERVAL_MS = 300;

  // decorate default update() to add an alternating mesh material
  var self = this;
  var defaultUpdateFunction = this.actor.update;
  var decoratedUpdate = function(timeDeltaMillis)
  {
    // this = Actor
    // self = SaucerTriple
    this.object3D.material = (self.isFirstMaterial ? SaucerChaingun.MATERIAL1 : SaucerChaingun.MATERIAL2);

    self.frameCounter += 1;
    if (self.frameCounter === SaucerChaingun.FLICKER_FRAMES)
    {
      self.isFirstMaterial = !self.isFirstMaterial;
      self.frameCounter = 0;
    }

    defaultUpdateFunction.call(this, timeDeltaMillis);
  };
  this.actor.update = decoratedUpdate;

  // new state for this type
  this.frameCounter = null; // current flicker timer
  this.isFirstMaterial = true;  // current cyan/grey flicker state

  log('new SaucerChaingun at ', this.mesh.position);
  this.setupMoving();
};

// type constants
SaucerChaingun.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerChaingun.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerChaingun.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerChaingun.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerChaingun.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames

SaucerChaingun.prototype = Object.create(Saucer.prototype);

SaucerChaingun.prototype.shoot = function()
{
  Sound.enemyShoot();
  MY3.rotateObjectToLookAt(this.mesh, Player.position);
  var shot = Shot.newInstance(this, this.mesh.position, this.mesh.rotation, SaucerChaingun.SHOT_MATERIAL1, SaucerChaingun.SHOT_MATERIAL2);
  State.actors.add(shot.actor);
};
