'use strict';

// Yellow/grey enemy firing 10 consecutive shots with no warning.

var SaucerChaingun = Object.create(Saucer);

SaucerChaingun.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerChaingun.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerChaingun.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.yellow });
SaucerChaingun.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

// override
SaucerChaingun.performsShotWindup = false;
// override
SaucerChaingun.SHOTS_TO_FIRE = 10;
// override
SaucerChaingun.SHOT_INTERVAL_MS = 300;

SaucerChaingun.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
SaucerChaingun.frameCounter = null; // current flicker timer
SaucerChaingun.isYellow = true;  // current yellow/grey flicker state

SaucerChaingun.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(SaucerChaingun, Saucer.GEOMETRY, SaucerChaingun.MATERIAL);
  SaucerChaingun.scale.y = Saucer.MESH_SCALE_Y;
};

SaucerChaingun.shoot = function()
{
  MY3.rotateObjectToLookAt(this, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(SaucerChaingun, SaucerChaingun.position, SaucerChaingun.rotation, SaucerChaingun.SHOT_MATERIAL1, SaucerChaingun.SHOT_MATERIAL2);
  State.actors.push(shot);
  scene.add(shot);
};

// decorate default update() to add an alternating mesh material
SaucerChaingun.update = function(timeDeltaMillis)
{
  SaucerChaingun.material = (SaucerChaingun.isYellow ? SaucerChaingun.MATERIAL1 : SaucerChaingun.MATERIAL2);

  SaucerChaingun.frameCounter += 1;
  if (SaucerChaingun.frameCounter === SaucerChaingun.FLICKER_FRAMES)
  {
    SaucerChaingun.isYellow = !SaucerChaingun.isYellow;
    SaucerChaingun.frameCounter = 0;
  } 

  var proto = Object.getPrototypeOf(SaucerChaingun);
  proto.update.call(SaucerChaingun, timeDeltaMillis);
};
