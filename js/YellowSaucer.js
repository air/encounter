'use strict';

// Used by Enemy.js.

var YellowSaucer = Object.create(Saucer);

YellowSaucer.MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });
YellowSaucer.SHOT_MATERIAL = new THREE.MeshBasicMaterial({ color: C64.yellow });

YellowSaucer.init = function()
{
  // actually set up this Mesh using our materials
  THREE.Mesh.call(YellowSaucer, Saucer.GEOMETRY, YellowSaucer.MATERIAL);
  YellowSaucer.scale.y = Saucer.MESH_SCALE_Y;
}

YellowSaucer.shoot = function()
{
  MY3.rotateObjectToLookAt(this, Player.position);
  Sound.enemyShoot();
  var shot = Shot.newInstance(YellowSaucer, YellowSaucer.position, YellowSaucer.rotation, YellowSaucer.SHOT_MATERIAL);
  State.actors.push(shot);
  scene.add(shot);
}