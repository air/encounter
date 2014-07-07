'use strict';

// Used by Enemy.js.

var BlueSaucer = Saucer.newInstance();

BlueSaucer.RADIUS = Saucer.RADIUS; // need a copy for Shot.collideWithShips
BlueSaucer.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.SHOT_MATERIAL1 = new THREE.MeshBasicMaterial({ color: C64.cyan });
BlueSaucer.SHOT_MATERIAL2 = new THREE.MeshBasicMaterial({ color: C64.lightgrey });

BlueSaucer.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(BlueSaucer, Saucer.GEOMETRY, BlueSaucer.MATERIAL);
  BlueSaucer.scale.y = Saucer.MESH_SCALE_Y;
}

BlueSaucer.shoot = function()
{
  Sound.enemyShoot();
  var shot = Shot.newInstance(BlueSaucer, BlueSaucer.position, BlueSaucer.rotation, BlueSaucer.SHOT_MATERIAL1, BlueSaucer.SHOT_MATERIAL2);
  State.actors.push(shot);
  scene.add(shot);
}