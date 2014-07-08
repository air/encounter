'use strict';

// Used by Enemy.js.

// FIXME
// var proto = Saucer.newInstance();
var BlueSaucer = Object.create(Saucer);

// FIXME Mesh -> Saucer -> BlueSaucer
// BlueSaucer.RADIUS = Saucer.RADIUS; // need a copy for Shot.collideWithShips
BlueSaucer.MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });
BlueSaucer.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

// override
BlueSaucer.SHOTS_TO_FIRE = 3;

BlueSaucer.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(BlueSaucer, Saucer.GEOMETRY, BlueSaucer.MATERIAL);
  BlueSaucer.scale.y = Saucer.MESH_SCALE_Y;
}

BlueSaucer.shoot = function()
{
  MY3.rotateObjectToLookAt(this, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(BlueSaucer, BlueSaucer.position, BlueSaucer.rotation, BlueSaucer.SHOT_MATERIAL1, BlueSaucer.SHOT_MATERIAL2);
  State.actors.push(shot);
  scene.add(shot);
}

// decorate default update() to add an alternating mesh material
BlueSaucer.update = function(timeDeltaMillis)
{
  BlueSaucer.material = (BlueSaucer.material === BlueSaucer.MATERIAL1 ? BlueSaucer.MATERIAL2 : BlueSaucer.MATERIAL1); 

  var proto = Object.getPrototypeOf(BlueSaucer);
  proto.update.call(BlueSaucer, timeDeltaMillis);
}
