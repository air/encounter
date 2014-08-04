'use strict';

// Cyan/grey saucer firing three successive shots with windup sound.
// Used by Enemy.js.

var SaucerTriple = Object.create(Saucer);

SaucerTriple.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
SaucerTriple.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
SaucerTriple.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
SaucerTriple.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

// override
SaucerTriple.SHOTS_TO_FIRE = 3;

SaucerTriple.FLICKER_FRAMES = 3; // when flickering, show each colour for this many frames
SaucerTriple.frameCounter = null; // current flicker timer
SaucerTriple.isCyan = true;  // current cyan/grey flicker state

SaucerTriple.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(SaucerTriple, Saucer.GEOMETRY, SaucerTriple.MATERIAL);
  SaucerTriple.scale.y = Saucer.MESH_SCALE_Y;
};

SaucerTriple.shoot = function()
{
  MY3.rotateObjectToLookAt(this, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(SaucerTriple, SaucerTriple.position, SaucerTriple.rotation, SaucerTriple.SHOT_MATERIAL1, SaucerTriple.SHOT_MATERIAL2);
  State.actors.push(shot);
  scene.add(shot);
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
